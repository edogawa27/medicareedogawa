import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star, ThumbsUp, Flag, MoreHorizontal } from "lucide-react";

interface Review {
  id: string;
  patientName: string;
  patientAvatar: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

interface ReviewListProps {
  reviews?: Review[];
  title?: string;
  showFilters?: boolean;
  maxHeight?: string;
}

const ReviewList = ({
  reviews = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rating: 5,
      date: "2023-10-15",
      comment:
        "Dr. Smith was extremely professional and caring. The home visit was convenient and he took his time to explain everything thoroughly. Highly recommend!",
      helpful: 12,
      verified: true,
    },
    {
      id: "2",
      patientName: "Michael Chen",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      rating: 4,
      date: "2023-09-28",
      comment:
        "Nurse Rodriguez was knowledgeable and gentle during my treatment. The only reason for 4 stars is that she arrived 15 minutes late, but she did call ahead to notify me.",
      helpful: 8,
      verified: true,
    },
    {
      id: "3",
      patientName: "Emily Wilson",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      rating: 5,
      date: "2023-11-02",
      comment:
        "The physiotherapist was amazing! She provided exercises that really helped with my back pain. The convenience of not having to travel to a clinic made a huge difference.",
      helpful: 15,
      verified: true,
    },
    {
      id: "4",
      patientName: "David Thompson",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      rating: 3,
      date: "2023-10-05",
      comment:
        "Service was adequate but I expected more personalized care. The provider seemed rushed and didn't fully address all my concerns.",
      helpful: 3,
      verified: false,
    },
  ],
  title = "Patient Reviews",
  showFilters = true,
  maxHeight = "600px",
}: ReviewListProps) => {
  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          size={16}
          className={
            index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ));
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        {showFilters && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Most Recent
            </Button>
            <Button variant="outline" size="sm">
              Highest Rated
            </Button>
            <Button variant="outline" size="sm">
              Verified Only
            </Button>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to leave a review!
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto" style={{ maxHeight }}>
          {reviews.map((review) => (
            <Card key={review.id} className="p-4 border border-gray-200">
              <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <img src={review.patientAvatar} alt={review.patientName} />
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900">
                        {review.patientName}
                      </h3>
                      {review.verified && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-50 text-green-700 border-green-200"
                        >
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex mr-2">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>More options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="mt-3 text-gray-700">
                <p>{review.comment}</p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <ThumbsUp size={16} className="mr-1" />
                    <span>Helpful ({review.helpful})</span>
                  </Button>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                      >
                        <Flag size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Report review</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
