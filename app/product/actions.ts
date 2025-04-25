'use server';

import { createClient } from '@/utils/supabase/server'

type State = {
    success: boolean;
    message: string | null;
};

export async function cuprod(prevState: any, formData: FormData): Promise<State> {
    try {
        const supabase = await createClient()
        const mode = formData.get('mode');
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const cost = formData.get('cost') as string;
        const price = formData.get('price') as string;
        const image = formData.get('image') as File;
        if (!name || !cost || !price) {
            return { success: false, message: 'All fields are required.' };
        }

        const costValue = parseFloat(cost);
        const priceValue = parseFloat(price);
        if (isNaN(costValue) || isNaN(priceValue)) {
            return { success: false, message: 'Cost and Price must be valid numbers.' };
        }
        if (costValue < 0 || priceValue < 0) {
            return { success: false, message: 'Cost and Price must be positive.' };
        }

        // Upload image if a file was selected
        let imageUrl = '';
        if (image && typeof image !== 'string' && image.size > 0 && image.size < 1024 * 1024) {
            if (!['image/jpeg', 'image/png'].includes(image.type)) {
                return {
                    success: false,
                    message: 'Only JPG/PNG maximum size 1MB image files are allowed.',
                };
            }
            const fileName = `${Date.now()}-${image.name}`;
            const { data, error: uploadError } = await supabase.storage
                .from('attachments')
                .upload(fileName, image, {
                    cacheControl: '3600',
                    upsert: false,
                });
            if (uploadError) {
                return { success: false, message: 'Image upload failed.' };
            }
            const { data: { publicUrl } } = supabase.storage.from('attachments').getPublicUrl(fileName);
            imageUrl = publicUrl;
        }

        const payload = {
            name,
            cost: costValue,
            price: priceValue,
            ...(imageUrl && { attachments: imageUrl }),
        };
        console.log("payload", payload)

        if (mode === 'create') {
            const { error } = await supabase.from('product').insert(payload);
            if (error) {
                return { success: false, message: 'Failed to create product.' };
            }
        } else if (mode === 'edit' && id) {
            const { error } = await supabase.from('product').update(payload).eq('id', id);
            if (error) {
                return { success: false, message: 'Failed to update product.' };
            }
        }
        return { success: true, message: 'Saved successfully!' };
    } catch (error) {
        console.log("error", error)
        return {
            success: false,
            message:
                error instanceof Error ? error.message : 'Something went wrong.',
        };
    }
}
