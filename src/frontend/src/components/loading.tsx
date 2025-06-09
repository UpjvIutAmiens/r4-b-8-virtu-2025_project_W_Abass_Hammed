import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Loader size={24} className="text-brand animate-spin inset-0 m-auto" />
    </div>
  );
}
