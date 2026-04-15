import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { buildings, rooms } from "../../data/campusData";
import { MapPin, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Link } from "react-router";

// UL Campus center coordinates
const UL_CENTER = { lat: 52.6738, lng: -8.5739 };

const mapContainerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "0.5rem",
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
};

export function Map() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [showRooms, setShowRooms] = useState(false);

  // Google Maps API key
  const GOOGLE_MAPS_API_KEY = "AIzaSyCDlZU__f7fp7vA7skzT01M1_IIV-Wu61A";

  const filteredRooms = selectedBuilding
    ? rooms.filter((room) => room.building === selectedBuilding)
    : [];

  const selectedBuildingData = useMemo(
    () => buildings.find((b) => b.id === selectedBuilding),
    [selectedBuilding]
  );

  const handleMarkerClick = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    setSelectedMarker(buildingId);
    setShowRooms(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-[#00843D]">Campus Map</h1>
        <p className="text-slate-600">
          Interactive Google Map of the University of Limerick campus with all
          buildings and facilities
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interactive Map</CardTitle>
                <Badge variant="outline" className="gap-1">
                  <MapPin className="size-3" />
                  {buildings.length} Buildings
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={UL_CENTER}
                  zoom={15}
                  options={mapOptions}
                >
                  {/* Building Markers */}
                  {buildings.map((building) => (
                    <Marker
                      key={building.id}
                      position={building.coordinates}
                      title={building.fullName}
                      onClick={() => handleMarkerClick(building.id)}
                      icon={{
                        url:
                          selectedBuilding === building.id
                            ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      }}
                    />
                  ))}

                  {/* Info Window for selected building */}
                  {selectedMarker && selectedBuildingData && (
                    <InfoWindow
                      position={selectedBuildingData.coordinates}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2">
                        <h3 className="font-semibold text-base mb-1">
                          {selectedBuildingData.fullName}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {selectedBuildingData.description}
                        </p>
                        <Badge className="text-xs">
                          {selectedBuildingData.type}
                        </Badge>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>

              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700">
                    <p className="font-semibold mb-1">How to use:</p>
                    <ul className="space-y-1">
                      <li>• Click on any marker to view building details</li>
                      <li>• Red markers are available buildings</li>
                      <li>• Blue marker shows your selected building</li>
                      <li>• Use the dropdown below to filter by building</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Building Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Building</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedBuilding || ""}
                onValueChange={(value) => {
                  setSelectedBuilding(value);
                  setShowRooms(true);
                  setSelectedMarker(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name} - {building.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Building Info */}
          {selectedBuilding && selectedBuildingData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Building Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedBuildingData.fullName}
                    </h3>
                    <Badge className="mt-2">{selectedBuildingData.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {selectedBuildingData.description}
                  </p>
                  <div className="pt-3 border-t">
                    <div className="text-sm text-slate-600">
                      <strong>Rooms in this building:</strong> {filteredRooms.length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rooms List */}
          {showRooms && selectedBuilding && filteredRooms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Rooms ({filteredRooms.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredRooms.map((room) => (
                    <Link key={room.id} to={`/room/${room.id}`}>
                      <div className="p-3 border rounded-lg hover:bg-slate-50 transition cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{room.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {room.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-600">
                          {room.floor} • Capacity: {room.capacity}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle className="text-lg">Map Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="https://www.ul.ie/buildings/campus-maps"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-[#00843D] hover:underline"
              >
                → Official UL Campus Maps
              </a>
              <a
                href="https://www.timetable.ul.ie/UA/RoomDetails.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-[#00843D] hover:underline"
              >
                → UL Room Finder
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}