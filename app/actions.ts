'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import supabaseAdmin from '@/lib/supabaseAdmin';

export const updateUserRole = async (userId: string, role: string) => {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  });

  if (error) {
    console.error('Failed to update role:', error.message);
    throw new Error(error.message);
  }
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();
  const username = formData.get('username')?.toString();
  const phone = formData.get('phone')?.toString();

  const origin = (await headers()).get('origin') || '';
  const supabase = await createClient();

  // ✅ Validate inputs
  if (!email || !password || !confirmPassword || !username || !phone) {
    return encodedRedirect('error', '/sign-up', 'All fields are required');
  }

  if (password !== confirmPassword) {
    return encodedRedirect('error', '/sign-up', 'Passwords do not match');
  }

  if (phone.length !== 10 || !/^\d+$/.test(phone)) {
    return encodedRedirect(
      'error',
      '/sign-up',
      'Phone number must be exactly 10 digits',
    );
  }

  // ✅ Check email (from auth)
  const { data: userList, error: listError } =
    await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError.message);
    return encodedRedirect('error', '/sign-up', 'Failed to validate email');
  }

  const existingEmail = userList.users.find((user) => user.email === email);
  if (existingEmail) {
    return encodedRedirect('error', '/sign-up', 'Email is already registered');
  }
  console.log('existingEmail', existingEmail);

  // ✅ Check username/phone from profiles
  const { data: existingProfile, error: profileCheckError } =
    await supabaseAdmin
      .from('profiles')
      .select('id')
      .or(`username.eq.${username},phone.eq.${phone}`)
      .maybeSingle();

  if (profileCheckError) {
    console.error('Profile check failed:', profileCheckError.message);
    return encodedRedirect('error', '/sign-up', 'Validation failed');
  }

  if (existingProfile) {
    return encodedRedirect(
      'error',
      '/sign-up',
      'Username or phone is already taken',
    );
  }

  // ✅ Sign up user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.user) {
    return encodedRedirect(
      'error',
      '/sign-up',
      error?.message ?? 'Sign-up failed',
    );
  }

  const user = data.user;

  // ✅ Add to user_metadata
  const { error: metaError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    {
      user_metadata: {
        role: 'user',
        username,
        phone,
      },
    },
  );

  if (metaError) {
    console.error('Metadata error:', metaError.message);
    return encodedRedirect(
      'error',
      '/sign-up',
      'Sign-up succeeded but failed to set user profile',
    );
  }

  // ✅ Insert into profiles table
  const { error: profileInsertError } = await supabaseAdmin
    .from('profiles')
    .insert([
      {
        id: user.id,
        email: user.email,
        username,
        phone,
        role: 'user',
      },
    ]);

  if (profileInsertError) {
    console.error('Profile insert error:', profileInsertError.message);
    return encodedRedirect(
      'error',
      '/sign-up',
      'Sign-up succeeded but failed to save profile',
    );
  }

  // ✅ Success
  return encodedRedirect(
    'success',
    '/sign-up',
    'Thanks for signing up! Please check your email for a verification link.',
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message);
  }

  return redirect('/');
};

// export const forgotPasswordAction = async (formData: FormData) => {
//   const email = formData.get('email')?.toString();
//   const supabase = await createClient();
//   const origin = (await headers()).get('origin');
//   const callbackUrl = formData.get('callbackUrl')?.toString();

//   if (!email) {
//     return encodedRedirect('error', '/forgot-password', 'Email is required');
//   }

//   const { error } = await supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
//   });

//   if (error) {
//     console.error(error.message);
//     return encodedRedirect(
//       'error',
//       '/forgot-password',
//       'Could not reset password',
//     );
//   }

//   if (callbackUrl) {
//     return redirect(callbackUrl);
//   }

//   return encodedRedirect(
//     'success',
//     '/forgot-password',
//     'Check your email for a link to reset your password.',
//   );
// };

// export const resetPasswordAction = async (formData: FormData) => {
//   const supabase = await createClient();

//   const password = formData.get('password') as string;
//   const confirmPassword = formData.get('confirmPassword') as string;

//   if (!password || !confirmPassword) {
//     encodedRedirect(
//       'error',
//       '/protected/reset-password',
//       'Password and confirm password are required',
//     );
//   }

//   if (password !== confirmPassword) {
//     encodedRedirect(
//       'error',
//       '/protected/reset-password',
//       'Passwords do not match',
//     );
//   }

//   const { error } = await supabase.auth.updateUser({
//     password: password,
//   });

//   if (error) {
//     encodedRedirect(
//       'error',
//       '/protected/reset-password',
//       'Password update failed',
//     );
//   }

//   encodedRedirect('success', '/protected/reset-password', 'Password updated');
// };

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};
