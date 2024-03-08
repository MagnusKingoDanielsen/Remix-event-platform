export async function uploadImage(imageFile) {
  const imageData = await imageFile.arrayBuffer(); // Convert the image file to ArrayBuffer
  const buffer = Buffer.from(imageData); // Convert ArrayBuffer to Node.js Buffer

  const url = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_PROJECT_ID}.appspot.com/o/${imageFile.name}`; // URL to upload image to Firebase Storage

  // POST request to upload image
  const response = await fetch(url, {
    method: "POST",
    body: buffer,
    headers: { "Content-Type": imageFile.type },
  });
  const data = await response.json();

  if (!data) {
    throw new Error("Image upload failed");
  }

  const imageUrl = `${url}?alt=media`;
  console.log("upload-handler" + imageUrl);

  return imageUrl;
}

export async function deleteImage(imageUrl) {
  // DELETE request to delete image
  const response = await fetch(imageUrl, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Image deletion failed");
  }

  console.log("Image deleted successfully");

  return true;
}
