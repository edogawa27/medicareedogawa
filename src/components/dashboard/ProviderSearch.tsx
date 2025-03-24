import React, { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Filter,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProviderCardProps {
  provider: {
    id: string;
    name: string;
    specialty: string;
    location: string;
    rating: number;
    reviewCount: number;
    price: number;
    availability: string;
    image: string;
  };
  onSelect?: () => void;
}

// Inline ProviderCard component since we can't import it
const ProviderCard = ({ provider, onSelect = () => {} }: ProviderCardProps) => {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
            <img
              src={provider.image}
              alt={provider.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-sm">{provider.name}</h3>
            <p className="text-sm text-gray-500">{provider.specialty}</p>
          </div>
        </div>

        <div className="space-y-2 mb-3 flex-grow">
          <div className="flex items-center text-sm">
            <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1" />
            <span className="text-gray-600">{provider.location}</span>
          </div>

          <div className="flex items-center text-sm">
            <Star className="h-3.5 w-3.5 text-yellow-400 mr-1" />
            <span className="text-gray-600">
              {provider.rating} ({provider.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center text-sm">
            <DollarSign className="h-3.5 w-3.5 text-gray-400 mr-1" />
            <span className="text-gray-600">${provider.price}/hour</span>
          </div>

          <div className="text-sm">
            <span className="text-green-600 font-medium">
              {provider.availability}
            </span>
          </div>
        </div>

        <Button onClick={onSelect} className="w-full mt-2">
          Lihat Profil
        </Button>
      </div>
    </Card>
  );
};

interface ProviderSearchProps {
  onProviderSelect?: (providerId: string) => void;
}

const ProviderSearch = ({
  onProviderSelect = () => {},
}: ProviderSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [rating, setRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for healthcare providers
  const mockProviders = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      location: "Jakarta, Indonesia",
      rating: 4.8,
      reviewCount: 124,
      price: 150,
      availability: "Available Today",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      location: "Surabaya, Indonesia",
      rating: 4.9,
      reviewCount: 89,
      price: 180,
      availability: "Available Tomorrow",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    },
    {
      id: "3",
      name: "Perawat Rebecca Taylor",
      specialty: "Perawat Rumah",
      location: "Bandung, Indonesia",
      rating: 4.7,
      reviewCount: 56,
      price: 90,
      availability: "Available Today",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rebecca",
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      specialty: "Fisioterapis",
      location: "Medan, Indonesia",
      rating: 4.6,
      reviewCount: 78,
      price: 120,
      availability: "Available in 2 days",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    },
    {
      id: "5",
      name: "Dr. Emily Rodriguez",
      specialty: "Dokter Umum",
      location: "Semarang, Indonesia",
      rating: 4.5,
      reviewCount: 112,
      price: 100,
      availability: "Available Today",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    },
    {
      id: "6",
      name: "Terapis David Kim",
      specialty: "Kesehatan Mental",
      location: "Yogyakarta, Indonesia",
      rating: 4.9,
      reviewCount: 67,
      price: 130,
      availability: "Available Tomorrow",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    },
    {
      id: "7",
      name: "Dr. Rina Wijaya",
      specialty: "Dokter Gigi",
      location: "Jakarta, Indonesia",
      rating: 4.7,
      reviewCount: 93,
      price: 140,
      availability: "Available Today",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rina",
    },
    {
      id: "8",
      name: "Dr. Budi Santoso",
      specialty: "Dokter Anak",
      location: "Surabaya, Indonesia",
      rating: 4.8,
      reviewCount: 105,
      price: 160,
      availability: "Available Tomorrow",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
    },
    {
      id: "9",
      name: "Perawat Siti Aminah",
      specialty: "Perawat Lansia",
      location: "Bandung, Indonesia",
      rating: 4.6,
      reviewCount: 72,
      price: 85,
      availability: "Available Today",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=siti",
    },
  ];

  // Filter providers based on search criteria
  const filteredProviders = mockProviders.filter((provider) => {
    const matchesSearch =
      searchQuery === "" ||
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      specialty === "" || provider.specialty === specialty;
    const matchesLocation =
      location === "" || provider.location.includes(location);
    const matchesPrice =
      provider.price >= priceRange[0] && provider.price <= priceRange[1];
    const matchesRating =
      rating === "" || provider.rating >= parseFloat(rating);

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesLocation &&
      matchesPrice &&
      matchesRating
    );
  });

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan nama atau spesialisasi"
            className="pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter toggle */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Tenaga Kesehatan</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Filters section */}
        {showFilters && (
          <Card className="border border-gray-200">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Lokasi
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Lokasi</SelectItem>
                    <SelectItem value="Jakarta">Jakarta</SelectItem>
                    <SelectItem value="Surabaya">Surabaya</SelectItem>
                    <SelectItem value="Bandung">Bandung</SelectItem>
                    <SelectItem value="Medan">Medan</SelectItem>
                    <SelectItem value="Semarang">Semarang</SelectItem>
                    <SelectItem value="Yogyakarta">Yogyakarta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Spesialisasi
                </label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Spesialisasi</SelectItem>
                    <SelectItem value="Cardiologist">Kardiologis</SelectItem>
                    <SelectItem value="Neurologist">Neurologis</SelectItem>
                    <SelectItem value="Perawat Rumah">Perawat Rumah</SelectItem>
                    <SelectItem value="Fisioterapis">Fisioterapis</SelectItem>
                    <SelectItem value="Dokter Umum">Dokter Umum</SelectItem>
                    <SelectItem value="Kesehatan Mental">
                      Kesehatan Mental
                    </SelectItem>
                    <SelectItem value="Dokter Gigi">Dokter Gigi</SelectItem>
                    <SelectItem value="Dokter Anak">Dokter Anak</SelectItem>
                    <SelectItem value="Perawat Lansia">
                      Perawat Lansia
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  Rentang Harga (${priceRange[0]} - ${priceRange[1]})
                </label>
                <Slider
                  defaultValue={[0, 200]}
                  max={300}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-500" />
                  Rating Minimum
                </label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Rating</SelectItem>
                    <SelectItem value="3">3+ Bintang</SelectItem>
                    <SelectItem value="4">4+ Bintang</SelectItem>
                    <SelectItem value="4.5">4.5+ Bintang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="available">Tersedia Hari Ini</TabsTrigger>
            <TabsTrigger value="top-rated">Peringkat Tertinggi</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onSelect={() => onProviderSelect(provider.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Tidak ada tenaga kesehatan yang sesuai dengan kriteria
                  pencarian Anda
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="available" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders
                .filter((provider) => provider.availability.includes("Today"))
                .map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onSelect={() => onProviderSelect(provider.id)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="top-rated" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders
                .filter((provider) => provider.rating >= 4.8)
                .map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onSelect={() => onProviderSelect(provider.id)}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderSearch;
