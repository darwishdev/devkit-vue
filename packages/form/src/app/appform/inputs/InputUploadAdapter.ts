import { FileCreateBulkRequest, FileObject } from "@/pkg/types/api_types";

export const createFileRequestFromFile = async (file: File, bucketName: string) => {
  const arrayBuffer = await file.arrayBuffer();
  return {
    path: `${file.name}`,
    bucketName,
    reader: new Uint8Array(arrayBuffer),
    fileType: file.type,
  };
};
export const createFileBulkRequestFromFiles = async (files: File[], bucketName: string): Promise<FileCreateBulkRequest> => {
  const fileRequests = await Promise.all(
    files.map(async (file) => await createFileRequestFromFile(file, bucketName)),
  );
  return {
    files: fileRequests,
  };
};
export const fileObjectFromFile = (file: File, bucketName: string): FileObject => {
  return {
    name: file.name,
    bucketId: bucketName,
    owner: '',
    id: '',
    updatedAt: '',
    createdAt: '',
    lastAccessedAt: ''

  };
}
export const fileObjectFromFiles = (files: File[], bucketName: string): FileObject[] => {
  return files.map((file) => fileObjectFromFile(file, bucketName))
};

export const fileFromFileObject = async (baseUrl: string, fileObj: FileObject): Promise<File | null> => {
  try {
    const fileUrl = `${baseUrl}/${fileObj.name}`;
    const response = await fetch(fileUrl);
    if (!response.ok) {
      console.error("Failed to fetch file from Supabase:", response.statusText);
      return null;
    }

    const blob = await response.blob();
    const contentType = blob.type || "application/octet-stream";

    return new File([blob], fileObj.name, { type: contentType });
  } catch (error) {
    console.error("Error converting FileObject to File:", error);
    return null;
  }
};
