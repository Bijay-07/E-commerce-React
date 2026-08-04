const cloudinary = require("../utils/cloudinary");


const getDataUri = (file) => {

    if (!file || !file.mimetype || !file.buffer) {
        throw new Error("Invalid file data");
    }

    const fileBase64 = file.buffer.toString("base64");

    return {
        content: `data:${file.mimetype};base64,${fileBase64}`,
        extName: file.mimetype.split("/")[1],
    };

};


const uploadToCloudinary = (fileBuffer) => {

    return new Promise((resolve, reject) => {

        cloudinary.uploader.upload_stream(
            {
                folder: "products"
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }

            }
        ).end(fileBuffer);

    });

};


module.exports = {
    getDataUri,
    uploadToCloudinary
};