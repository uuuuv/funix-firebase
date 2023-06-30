function FileUpload({ uploadFile }) {
  return (
    <div className="d-flex p-2 border rounded">{uploadFile.file.name}</div>
  );
}

function UploadFiles({ uploadFiles }) {
  return (
    <div className="">
      {uploadFiles.map((uploadFile) => (
        <FileUpload uploadFile={uploadFile} key={uploadFile.file.name} />
      ))}
    </div>
  );
}

export default UploadFiles;
