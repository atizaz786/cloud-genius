"use client";

import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import {  Code, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import ReactMarkDown from "react-markdown";

import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam, CreateChatCompletionRequestMessage } from "openai/resources/index.mjs";
import ChatCompletionRequestMessage from "openai";
import { Empty } from "@/components/empty";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Loader } from "@/components/loader";

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);

console.log()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: any = { role: "user", content: values.prompt };
      const newMessages = [...messages, userMessage];
      
      const response = await axios.post('/api/code', { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data]);
      console.log("messages",messages)
      
      form.reset();
    } catch (error: any) {
        //TODO: Open Pro Model
      console.error(error);
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate Code using OpenAI's GPT-3.5"
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Simple toggle button using React and TailwindCSS"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Generate"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
        {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
           <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
           
            {messages.map((message) => (
              <div 
                key={message.content} 
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkDown components={{
                  pre: ({node, ...props}) => (
                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                      <pre {...props} />
                    </div>
                  ),
                  code: ({node, ...props}) => (
                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                  )
                }}
                className="text-sm overflow-hidden leading-7"
                >
         
                  {message.content}
                </ReactMarkDown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;