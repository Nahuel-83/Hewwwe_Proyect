const uploadPreset = 'hewwwe';
const cloudName = 'dhzmaksfd';
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    try {
        console.log('Uploading to Cloudinary:', uploadUrl);
        console.log('Upload preset:', uploadPreset);
        
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Cloudinary error details:', errorData);
            throw new Error(`Cloudinary error: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log('Upload successful, response:', data);
        return data.secure_url || data.url;
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        throw error;
    }
};