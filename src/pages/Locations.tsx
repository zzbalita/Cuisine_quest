import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Map from "@/components/Map";
import { useToast } from "@/hooks/use-toast";

interface Restaurant {
  name: string;
  lat: number;
  lng: number;
  dishes: string[];
  rating: number;
  address: string;
}

const Locations = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<[number, number]>([21.03, 105.85]);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      name: "Phở Thìn Bờ Hồ",
      lat: 21.0354,
      lng: 105.8490,
      dishes: ["Phở Bò", "Phở Gà"],
      rating: 4.8,
      address: "13 Lò Đúc, Hoàn Kiếm, Hà Nội"
    },
    {
      name: "Cơm Tấm Sài Gòn",
      lat: 21.0285,
      lng: 105.8542,
      dishes: ["Cơm Tấm Sườn", "Chả Trứng"],
      rating: 4.5,
      address: "45 Nguyễn Du, Hai Bà Trưng, Hà Nội"
    },
    {
      name: "Bánh Mì 25",
      lat: 21.0315,
      lng: 105.8470,
      dishes: ["Bánh Mì Thịt", "Bánh Mì Pate"],
      rating: 4.7,
      address: "25 Hàng Cá, Hoàn Kiếm, Hà Nội"
    },
    {
      name: "Bún Chả Hàng Mành",
      lat: 21.0320,
      lng: 105.8520,
      dishes: ["Bún Chả", "Nem Rán"],
      rating: 4.9,
      address: "1 Hàng Mành, Hoàn Kiếm, Hà Nội"
    },
    {
      name: "Gỏi Cuốn Sài Gòn",
      lat: 21.0300,
      lng: 105.8480,
      dishes: ["Gỏi Cuốn Tôm", "Gỏi Cuốn Thịt"],
      rating: 4.6,
      address: "78 Tràng Tiền, Hoàn Kiếm, Hà Nội"
    },
    {
      name: "Bún Bò Nam Bộ",
      lat: 21.0340,
      lng: 105.8510,
      dishes: ["Bún Bò", "Bún Thịt Nướng"],
      rating: 4.7,
      address: "67 Hàng Điếu, Hoàn Kiếm, Hà Nội"
    }
  ]);

  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          toast({
            title: "Vị trí đã được xác định",
            description: "Đang hiển thị các quán ăn gần bạn",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Không thể xác định vị trí",
            description: "Sử dụng vị trí mặc định tại Hà Nội",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.dishes.some((dish) =>
          dish.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredRestaurants(filtered);
    
    if (filtered.length === 0) {
      toast({
        title: "Không tìm thấy kết quả",
        description: "Thử tìm kiếm với từ khóa khác",
        variant: "destructive",
      });
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          toast({
            title: "Đã cập nhật vị trí",
            description: "Bản đồ đã di chuyển đến vị trí hiện tại của bạn",
          });
        },
        () => {
          toast({
            title: "Lỗi vị trí",
            description: "Không thể truy cập vị trí của bạn",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="border-b border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Món Ngon Quanh Ta
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Tìm kiếm quán ăn ngon gần bạn với đánh giá và món ăn đặc sắc
          </p>

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex flex-1 items-center overflow-hidden rounded-full border-2 border-secondary/20 bg-card shadow-lg">
              <Input
                type="text"
                placeholder="Nhập tên món ăn, quán ăn hoặc địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-12 border-0 bg-transparent px-6 focus-visible:ring-0"
              />
              <Button 
                size="lg" 
                onClick={handleSearch}
                className="h-12 rounded-l-none rounded-r-full bg-secondary px-6 hover:bg-secondary/90"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Tìm
              </Button>
            </div>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleCurrentLocation}
              className="h-12 rounded-full px-6"
            >
              <Navigation className="mr-2 h-5 w-5" />
              Vị trí của tôi
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Bản đồ quán ăn
          </h2>
          <p className="text-muted-foreground">
            {filteredRestaurants.length} quán ăn được tìm thấy
          </p>
        </div>
        
        <Map 
          restaurants={filteredRestaurants} 
          center={userLocation}
          zoom={13}
        />
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Danh sách quán ăn
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRestaurants.map((restaurant, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="p-6">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1">
                    <span className="text-sm">⭐</span>
                    <span className="text-sm font-semibold text-foreground">
                      {restaurant.rating}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{restaurant.address}</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Món đặc sắc:</p>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.dishes.map((dish, dishIndex) => (
                      <span
                        key={dishIndex}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Hôm Nay Ăn Gì. Khám phá thế giới ẩm thực Việt Nam.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Locations;
