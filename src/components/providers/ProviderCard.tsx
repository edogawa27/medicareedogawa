import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ProviderCardProps {
  id?: string;
  name?: string;
  specialty?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  availability?: string;
  price?: number;
  distance?: string;
  onBookNow?: (id: string) => void;
  onViewProfile?: (id: string) => void;
}

const ProviderCard = ({
  id = "1",
  name = "Dr. Sarah Johnson",
  specialty = "Physiotherapist",
  rating = 4.8,
  reviewCount = 124,
  imageUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1",
  availability = "Available Today",
  price = 85,
  distance = "2.5 km away",
  onBookNow = () => {},
  onViewProfile = () => {},
}: ProviderCardProps) => {
  const handleBookNow = () => {
    onBookNow(id);
  };

  const handleViewProfile = () => {
    onViewProfile(id);
  };

  return (
    <Card className="w-full max-w-[350px] overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/10">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{specialty}</p>
          </div>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            {availability}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">
              ({reviewCount} reviews)
            </span>
          </div>
          <span className="text-sm text-muted-foreground">{distance}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-primary font-semibold">${price}/hour</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleViewProfile}
              >
                View Profile
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>See full provider details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="flex-1" onClick={handleBookNow}>
                Book Now
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Schedule an appointment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default ProviderCard;
