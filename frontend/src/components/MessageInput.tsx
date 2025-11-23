import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "./ui/Loader";

// Define the component as a functional component (FC) if preferred,
// but using 'const MessageInput = () =>' is sufficient.
const MessageInput = () => {
  // 1. STATE TYPE CORRECTIONS
  const [text, setText] = useState<string>("");
  // imagePreview can be string (URL) or null
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // isSending is boolean
  const [isSending, setIsSending] = useState<boolean>(false);

  // 2. REF TYPE CORRECTION: HTMLInputElement | null
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChatStore();

  // 3. EVENT TYPE CORRECTION: ChangeEvent<HTMLInputElement>
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check if files exist before accessing index 0
    const file = e.target.files ? e.target.files[0] : null;

    if (!file || !file.type.startsWith("image/")) {
      if (file) toast.error("Please select an image file");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImagePreview(null);
    // Use optional chaining for ref.current, though it is checked in the logic
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 4. EVENT TYPE CORRECTION: FormEvent
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      let myForm = new FormData();
      myForm.append("text", text.trim());

      // Access files safely using optional chaining
      let image = fileInputRef.current?.files?.[0];

      if (image) {
        // Ensure 'image' is of type Blob or File for FormData
        myForm.append("image", image);
      }

      setIsSending(true);
      // sendMessage expects FormData as the type, which is compatible with 'any' or the type defined in your store
      await sendMessage(myForm);

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      // Use 'any' for the catch block error as requested
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          {isSending ? <Loader /> : <Send size={22} />}
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
