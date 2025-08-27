import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

const verifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast.success("Signup successful", {
        description: response.data.message,
      });
      router.replace("sign-in");
    } catch (error) {
      console.error("Error signing up: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Signup failed", {
        description: axiosError.response?.data.message,
        action: {
          label: "Retry",
          onClick: () => console.log("Retry signup"),
        },
      });
    }
  };
  return <div>verifyAccount</div>;
};

export default verifyAccount;
