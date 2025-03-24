import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ReviewFormProps {
  providerId?: string;
  onSubmit?: (data: ReviewFormValues) => void;
  className?: string;
}

interface ReviewFormValues {
  rating: number;
  comment: string;
}

const formSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(500, "Comment must not exceed 500 characters"),
});

const ReviewForm = ({
  providerId = "123",
  onSubmit,
  className = "",
}: ReviewFormProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const handleSubmit = (data: ReviewFormValues) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Review submitted:", data);
    }
    form.reset();
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`${hoveredRating >= star || field.value >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <FormDescription>
                  Rate your experience with this healthcare provider
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your experience with this healthcare provider..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your review helps others make informed decisions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="px-6">
              Submit Review
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReviewForm;
