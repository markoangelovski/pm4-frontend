export default function ApiReference() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
  const apireferencePath = process.env.NEXT_PUBLIC_APIREFERENCE_PATH;

  return (
    <iframe
      src={`${backendUrl}${apireferencePath}`}
      width="100%"
      height="100%"
    ></iframe>
  );
}
