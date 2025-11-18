import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import API from "@/config";
interface EventPhotoGalleryProps {
  photos: string[];
  eventName: string;
}

const EventPhotoGallery = ({ photos, eventName }: EventPhotoGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, idx) => (
          <Card
            key={idx}
            className="overflow-hidden rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <CardContent className="p-0">
              <img
                src={photo}
                alt={`${eventName} ${idx + 1}`}
                className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt="Selected Event"
              className="w-full h-auto rounded-xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'Wellness' | 'Holidays/Festivals' | 'Sports/Entertainment' | 'BOM-Birthdays of the Month';
  registrationOpen?: boolean;
  images?: string[];
  folder?: string;       // 👈 add this
  imageCount?: number;   // 👈 add this
  details?: { name: string; date: string }[];
}


const EmployeeEngagement = () => {
  // ✅ All hooks first
const [activeSection, setActiveSection] = useState('upcoming');
const [activeCategory, setActiveCategory] = useState('all');
const [dynamicPastEvents, setDynamicPastEvents] = useState<Partial<Event>[]>([]);
const [selectedPastEvent, setSelectedPastEvent] = useState<Partial<Event> | null>(null);
const [selectedBomEvent, setSelectedBomEvent] = useState<Event | null>(null); // 👈 added this

// ✅ Then computed variables
const today = new Date();
const upcomingEvents = events.filter(event => new Date(event.date) >= today);
const filteredEvents =
  activeSection === "upcoming"
    ? activeCategory === "all"
      ? upcomingEvents
      : upcomingEvents.filter(event => event.type === activeCategory)
    : [];


  useEffect(() => {
  if (activeSection === "past") {
    fetch(`${API}/api/past-events`)
      .then(res => res.json())
      .then(data => setDynamicPastEvents(data))
      .catch(err => {
        console.error("Error fetching past events:", err);
        setDynamicPastEvents([]);
      });
  }
}, [activeSection]);


  

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Employee Engagement</h1>
        <p className="text-muted-foreground">Connect, participate, and grow with your colleagues</p>
      </div>

      <div>
        <div className="grid w-full grid-cols-5 max-w-[600px]">
          <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-securekloud-700" />
          </div>
          <h2 className="text-2xl font-bold">Events</h2>



        </div>

        <div className="flex gap-4 mt-4">
          <Button
            variant={activeSection === 'upcoming' ? 'default' : 'outline'}
            onClick={() => {
              setActiveSection('upcoming');
              setActiveCategory('all');
            }}
          >
            Upcoming Events
          </Button>
          <Button
            variant={activeSection === 'past' ? 'default' : 'outline'}
            onClick={() => {
              setActiveSection('past');
              setActiveCategory('all');
            }}
          >
            Past Events
          </Button>
        </div>

        {activeSection === 'upcoming' && (
          <div className="flex gap-4 mt-4">
            <Button variant={activeCategory === 'all' ? 'default' : 'outline'} onClick={() => setActiveCategory('all')}>All Events</Button>
            <Button variant={activeCategory === 'Wellness' ? 'default' : 'outline'} onClick={() => setActiveCategory('Wellness')}>Wellness</Button>
            <Button variant={activeCategory === 'Holidays/Festivals' ? 'default' : 'outline'} onClick={() => setActiveCategory('Holidays/Festivals')}>Holidays/Festivals</Button>
            <Button variant={activeCategory === 'Sports/Entertainment' ? 'default' : 'outline'} onClick={() => setActiveCategory('Sports/Entertainment')}>Sports/Entertainment</Button>
            <Button variant={activeCategory === 'BOM-Birthdays of the Month' ? 'default' : 'outline'} onClick={() => setActiveCategory('BOM-Birthdays of the Month')}>BOM-Birthdays</Button>
          </div>
        )}

        {activeSection === 'past' ? (
          <div className="mt-6">
            <label htmlFor="past-events" className="block font-medium mb-2">Past Events</label>
           <select
  id="past-events"
  className="w-full p-2 border rounded"
  onChange={(e) => {
    const selectedEventId = e.target.value;
    const selected = dynamicPastEvents.find(ev => ev.id === selectedEventId) || null;
    setSelectedPastEvent(selected);
  }}
>
  <option value="">-- Select a past event --</option>
  {dynamicPastEvents.map(event => (
    <option key={event.id} value={event.id}>
      {event.title}
    </option>
  ))}
</select>

            
            {selectedPastEvent && (
  <div className="mt-4">
    <h3 className="text-xl font-semibold mb-2">{selectedPastEvent.title} Photos</h3>
    {selectedPastEvent.images && selectedPastEvent.images.length > 0 ? (
      <EventPhotoGallery
        photos={selectedPastEvent.images as string[]}
        eventName={selectedPastEvent.title as string}
      />
    ) : (
      <p className="text-muted-foreground">No images available for this event.</p>
    )}
  </div>
)}


          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onViewDetails={(ev) => setSelectedBomEvent(ev)} />
            ))}
          </div>
        )}
      </div>

       <Dialog open={!!selectedBomEvent} onOpenChange={(open) => !open && setSelectedBomEvent(null)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{selectedBomEvent?.title || "Event Details"}</DialogTitle>
<DialogDescription>
  {selectedBomEvent?.details && selectedBomEvent.details.length > 0 ? (
    <div className="max-h-[600px] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {selectedBomEvent.details.map((bd, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-3 border rounded-lg shadow bg-white"
          >
            <img
              src={`/employee-images/${bd.employeeId}.jpg`}
              alt={bd.name}
              className="w-40 h-20 rounded-full object-cover mb-2"
              onError={(e) => {
                const currentSrc = e.currentTarget.src;
                if (currentSrc.endsWith(".jpg")) {
                  e.currentTarget.src = `/employee-images/${bd.employeeId}.png`;
                } else {
                  e.currentTarget.src = "/employee-images/default.png";
                }
              }}
            />
            <p className="text-sm font-medium text-center">{bd.name}</p>
            <p className="text-xs text-gray-500">{bd.date}</p>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>Failed to load birthdays. Check console for details.</p>
  )}
</DialogDescription>

    </DialogHeader>
  </DialogContent>
  
</Dialog>

    </div>
  );
};

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}
const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Wellness":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Holidays/Festivals":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Sports/Entertainment":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "BOM-Birthdays of the Month":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "Wellness":
        return Heart;
      case "Holidays/Festivals":
        return Calendar;
      case "Sports/Entertainment":
        return Trophy;
      case "BOM-Birthdays of the Month":
        return Users;
      default:
        return Calendar;
    }
  };

  const EventIcon = getEventIcon(event.type);

  const handleRegister = async () => {
    if (loading) return; // ✅ block multiple clicks
    setLoading(true);
    setStatusMsg("Submitting...");

    try {
      const res = await fetch(`${API}/api/registerEvent/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          eventName: event.title,
          user: "Current User", // replace with real user
          email: "user@example.com", // replace with real email
        }),
      });

      if (res.ok) {
        setStatusMsg("✅ Successfully registered!");
      } else {
        setStatusMsg("❌ Failed to register. Try again.");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("⚠️ Network error while registering.");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setStatusMsg("");
      }, 2000);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <Badge className={getBadgeVariant(event.type)}>{event.type}</Badge>
          {event.registrationOpen && (
            <Badge variant="outline" className="bg-green-50 text-green-800">
              Registration Open
            </Badge>
          )}
        </div>

        <div className="mt-3 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center mt-1">
            <EventIcon className="h-5 w-5 text-securekloud-700" />
          </div>
          <div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>
              {event.date} {event.location && `at ${event.location}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>

        <div className="flex flex-col gap-2 mt-4">
          {event.registrationOpen && (
            <Button
              onClick={handleRegister}
              disabled={loading}
              className={`flex-1 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Submitting..." : "Register Now"}
            </Button>
          )}

          <Button
            className="flex-1"
            variant="outline"
            onClick={() => onViewDetails(event)}
          >
            View Details
          </Button>

          {statusMsg && (
            <p className="text-center text-sm text-gray-600 mt-1">{statusMsg}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


export default EmployeeEngagement;

const events: Event[] = [
 


{
id: "4",
title: "BOM: April Birthdays",
date: "April 30, 2025",
location: "",
description: "Celebrating all April birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Saurav Sarkar A", date: "2/Apr", employeeId: "1001" },
{ name: "Hariharan V", date: "5/Apr", employeeId: "1002" },
{ name: "Priya P M", date: "7/Apr", employeeId: "1003" },
{ name: "Rathinasabapathi A", date: "10/Apr", employeeId: "1004" },
{ name: "Ooviyalakshmi K", date: "12/Apr", employeeId: "1005" },
{ name: "Abhinav Sutradhar", date: "13/Apr", employeeId: "1006" },
{ name: "Jegan R", date: "16/Apr", employeeId: "1007" },
{ name: "Roshan Amarsingh Maliye", date: "20/Apr", employeeId: "1008" },
{ name: "Sinthya Alex A", date: "21/Apr", employeeId: "1009" },
{ name: "Aishwarya R", date: "21/Apr", employeeId: "1010" },
{ name: "Kowsalya Palanisamy", date: "25/Apr", employeeId: "1011" }
]
},


{
id: "8",
title: "BOM: May Birthdays",
date: "May 31, 2025",
location: "",
description: "Celebrating all May birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Mohanraj R G", date: "1/May", employeeId: "1012" },
{ name: "Dilli Babu K", date: "2/May", employeeId: "1013" },
{ name: "Anand J", date: "3/May", employeeId: "1014" },
{ name: "Ashokkumar T", date: "3/May", employeeId: "1015" },
{ name: "Rajakumari S", date: "3/May", employeeId: "1016" },
{ name: "Nivashini S", date: "8/May", employeeId: "1017" },
{ name: "Kamatchi M", date: "8/May", employeeId: "1018" },
{ name: "Ezhilarasi S", date: "11/May", employeeId: "1019" },
{ name: "Agathees Kumar", date: "14/May", employeeId: "1020" },
{ name: "Velayutham G", date: "15/May", employeeId: "1021" },
{ name: "Jaiganesh S", date: "15/May", employeeId: "1022" },
{ name: "Saravana Kumar D", date: "16/May", employeeId: "1023" },
{ name: "Guru Prakash S", date: "16/May", employeeId: "1024" },
{ name: "Karthikeyan V", date: "17/May", employeeId: "1025" },
{ name: "Lakshmi A", date: "17/May", employeeId: "1026" },
{ name: "Hariprasaad G N", date: "18/May", employeeId: "1027" },
{ name: "Ramachandran S", date: "19/May", employeeId: "1028" },
{ name: "Senthil", date: "20/May", employeeId: "1029" },
{ name: "Anishkumar C", date: "21/May", employeeId: "1030" },
{ name: "Valarmathi V", date: "25/May", employeeId: "1031" },
{ name: "Nandraj Rathod", date: "26/May", employeeId: "1032" }
]
},




{
id: "12",
title: "BOM: June Birthdays",
date: "June 30, 2025",
location: "",
description: "Celebrating all June birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Radhika M", date: "2/Jun", employeeId: "1033" },
{ name: "Thulasiraja M", date: "2/Jun", employeeId: "1034" },
{ name: "Venkateswaran K", date: "2/Jun", employeeId: "1035" },
{ name: "Vijay Kumar M", date: "3/Jun", employeeId: "1036" },
{ name: "Chejerla Subrahmanyam", date: "5/Jun", employeeId: "1037" },
{ name: "Senthamizhselvan P", date: "5/Jun", employeeId: "1038" },
{ name: "Aravindh S", date: "6/Jun", employeeId: "1039" },
{ name: "Prasad N", date: "10/Jun", employeeId: "1040" },
{ name: "Subash Chandra Bose", date: "11/Jun", employeeId: "1041" },
{ name: "Nikita Kukreja", date: "12/Jun", employeeId: "1042" },
{ name: "Hari Prasad J", date: "13/Jun", employeeId: "1043" },
{ name: "Kirankumar B", date: "15/Jun", employeeId: "1044" },
{ name: "Diwakar N", date: "16/Jun", employeeId: "1045" },
{ name: "Pamulapati Kishore", date: "18/Jun", employeeId: "1046" },
{ name: "Venkata Siva Reddy M", date: "19/Jun", employeeId: "1047" },
{ name: "Senthil Babu R S", date: "20/Jun", employeeId: "B20025" },

{ name: "Jayakumar Karuppasamy", date: "21/Jun", employeeId: "1048" },
{ name: "Dharanitharan Murugan", date: "21/Jun", employeeId: "1049" },
{ name: "Magalakshmi M", date: "22/Jun", employeeId: "1050" },
{ name: "Sowmiya R", date: "26/Jun", employeeId: "1051" },
{ name: "Shalman M", date: "27/Jun", employeeId: "B22149" },

{ name: "Shanmugavel S", date: "28/Jun", employeeId: "1052" },
{ name: "Hariwasa S", date: "29/Jun", employeeId: "1053" },
{ name: "Vaitheeshwaran J", date: "30/Jun", employeeId: "1054" },
{ name: "Harini N k V", date: "30/Jun", employeeId: "B22085" },

]
},



{
id: "17",
title: "BOM: July Birthdays",
date: "July 31, 2025",
location: "",
description: "Celebrating all July birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Abirami Ravi", date: "2/Jul", employeeId: "1055" },
{ name: "Hemamalini K", date: "3/Jul", employeeId: "1056" },
{ name: "Abdul Khadir A", date: "3/jul", employeeId: "B25008" },

{ name: "Veerendra Kumar Meka R", date: "5/Jul", employeeId: "1057" },
{ name: "Manikandan V", date: "10/Jul", employeeId: "1058" },
{ name: "Abhinandhan V", date: "11/Jul", employeeId: "1059" },
{ name: "Tamilarasan P", date: "18/Jul", employeeId: "1060" },
{ name: "Harithasri S", date: "19/Jul", employeeId: "1061" },
{ name: "Sweetha B", date: "19/Jul", employeeId: "1062" },
{ name: "Kiran Balaji B", date: "19/Jul", employeeId: "1063" },
{ name: "Carol Praisy R", date: "21/Jul", employeeId: "1064" },
{ name: "Ragul Rathna T", date: "23/Jul", employeeId: "1065" },
{ name: "Vipul Vohra", date: "24/Jul", employeeId: "1066" },
{ name: "Priya K", date: "25/Jul", employeeId: "1067" },
{ name: "Sruthi S", date: "26/Jul", employeeId: "1068" },
{ name: "Ananth P", date: "30/Jul", employeeId: "1069" }
]
},
{
id: "18",
title: "Eye Check-up Camp",
date: "August 13, 2025",
location: "",
description: "Free eye check-up for employees.",
type: "Wellness",
registrationOpen: true
},
{
id: "19",
title: "Independence Day",
date: "August 15, 2025",
location: "",
description: "Celebrating India's Independence Day.",
type: "Holidays/Festivals"
},
{
id: "20",
title: "Friendship Day",
date: "August 4, 2025",
location: "",
description: "Celebrating Friendship Day with team activities.",
type: "Holidays/Festivals"
},
{
id: "21",
title: "World Photography Day",
date: "August 19, 2025",
location: "",
description: "Photography contest and activities.",
type: "Sports/Entertainment",
registrationOpen: true
},
{
id: "22",
title: "Vinayagar Chathurthi",
date: "August 27, 2025",
location: "",
description: "Celebrating Vinayagar Chathurthi festival.",
type: "Holidays/Festivals"
},
{
id: "23",
title: "BOM: August Birthdays",
date: "August 31, 2025",
location: "",
description: "Celebrating all August birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Prem Kumar G", date: "1/Aug", employeeId: "1070" },
{ name: "Pradeep V", date: "2/Aug", employeeId: "1071" },
{ name: "Rajthilak R", date: "2/Aug", employeeId: "1072" },
{ name: "Joshva Nathan M", date: "11/Aug", employeeId: "1073" },
{ name: "Karthick Gajapathy J", date: "13/Aug", employeeId: "1074" },
{ name: "Kishore Kumar S", date: "13/Aug", employeeId: "1075" },
{ name: "Priyanka Pannerselvam", date: "17/Aug", employeeId: "1076" },
{ name: "Rajkumar P", date: "19/Aug", employeeId: "1077" },
{ name: "Pagadavarapu Dileep", date: "20/Aug", employeeId: "1078" },
{ name: "Sachidanatham", date: "24/Aug", employeeId: "B22124" },

{ name: "Kameswaran R", date: "25/Aug", employeeId: "1079" }
]
},
{
id: "24",
title: "Yoga Session",
date: "September 2, 2025",
location: "",
description: "Yoga session for employee wellness.",
type: "Wellness",
registrationOpen: true
},
{
id: "25",
title: "Ayudha Pooja",
date: "September 30, 2025",
location: "",
description: "Celebrating Ayudha Pooja.",
type: "Holidays/Festivals"
},
{
id: "26",
title: "Pickle Ball Tournament",
date: "September 20, 2025",
location: "",
description: "Pickleball tournament for employees.",
type: "Sports/Entertainment",
registrationOpen: true
},
{
id: "27",
title: "BOM: September Birthdays",
date: "September 30, 2025",
location: "",
description: "Celebrating all September birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Ganesh R", date: "4/Sep", employeeId: "1080" },
{ name: "Sandhiya S", date: "4/Sep", employeeId: "1081" },
{ name: "Ramesh Sampath S", date: "12/Sep", employeeId: "1082" },
{ name: "Selvaraj", date: "13/Sep", employeeId: "1083" },
{ name: "Mohana Balasubramaniam", date: "14/Sep", employeeId: "1084" },
{ name: "Harikishore L", date: "22/Sep", employeeId: "1085" },
{ name: "Murali Krishnan R", date: "23/Sep", employeeId: "1086" },
{ name: "Tharun Kumar E", date: "25/Sep", employeeId: "1087" }
]
},
{
id: "28",
title: "Gandhi Jayanthi",
date: "October 2, 2025",
location: "",
description: "Celebrating Gandhi Jayanthi.",
type: "Holidays/Festivals"
},
{
id: "29",
title: "BOM: October Birthdays",
date: "October 31, 2025",
location: "",
description: "Celebrating all October birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Ashkar Ali A", date: "5/Oct", employeeId: "1088" },
{ name: "Manivannan K", date: "6/Oct", employeeId: "1089" },
{ name: "Vinni blessi Joice P", date: "6/Oct", employeeId: "1090" },
{ name: "Gunaselvam E", date: "7/Oct", employeeId: "1091" },
{ name: "Swetha R", date: "9/Oct", employeeId: "1092" },
{ name: "Krishnakumar V", date: "10/Oct",employeeId: "1093" },
{ name: "Kumar A", date: "13/Oct", employeeId: "1094" },
{ name: "Ashwinkumar R", date: "15/Oct", employeeId: "1095" },
{ name: "Riswana Fathima M S", date: "15/Oct", employeeId: "1096" },
{ name: "Nethaji S", date: "18/Oct", employeeId: "1097" },
{ name: "Vijayakumar P", date: "21/Oct", employeeId: "1098" },
{ name: "Ramesh Ram", date: "28/Oct", employeeId: "1099" },
{ name: "Poornima S", date: "28/Oct", employeeId: "1100" },
{ name: "Jayashree V", date: "31/Oct", employeeId: "1101" }
]
},
{
id: "30",
title: "Session on Healthy Routines & Fitness",
date: "October 10, 2025",
location: "",
description: "Workshop on maintaining healthy routines.",
type: "Wellness",
registrationOpen: true
},
{
id: "31",
title: "Deepavali",
date: "October 9, 2025",
location: "",
description: "Celebrating the festival of Deepavali.",
type: "Holidays/Festivals"
},
{
id: "32",
title: "Badminton Tournament",
date: "October 22, 2025",
location: "",
description: "Badminton tournament for employees.",
type: "Sports/Entertainment",
registrationOpen: true
},
{
id: "33",
title: "B-E Early Morning Beach Run (with Breakfast)",
date: "November 8, 2025",
location: "",
description: "Morning beach run followed by breakfast.",
type: "Wellness",
registrationOpen: true
},
{
id: "34",
title: "Men's Day",
date: "November 19, 2025",
location: "",
description: "Celebrating Men's Day with activities.",
type: "Holidays/Festivals"
},
{
id: "35",
title: "Bowling",
date: "November 22, 2025",
location: "",
description: "Bowling event for employees.",
type: "Sports/Entertainment",
registrationOpen: true
},
{
id: "36",
title: "BOM: November Birthdays",
date: "November 30, 2025",
location: "",
description: "Celebrating all November birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Mathana Krishnan S", date: "1/Nov", employeeId: "1102" },
{ name: "Veeresh M", date: "6/Nov", employeeId: "1103" },
{ name: "Swathi Rajagopal", date: "6/Nov", employeeId: "1104" },
{ name: "Abdul Azeez S", date: "10/Nov", employeeId: "1105" },
{ name: "Vijayalakshmi V", date: "13/Nov", employeeId: "1106" },
{ name: "Sriram R", date: "17/Nov", employeeId: "1107" },
{ name: "Pannem Srikanth", date: "17/Nov", employeeId: "1108" },
{ name: "Rajkumar I", date: "20/Nov", employeeId: "1109" },
{ name: "Priyanka C", date: "21/Nov", employeeId: "1110" },
{ name: "Balaji S", date: "23/Nov", employeeId: "1111" },
{ name: "Sabin Kumar Gupta", date: "24/Nov", employeeId: "1112" },
{ name: "Thumu Muni Venkata Surya", date: "27/Nov", employeeId: "1113" },
{ name: "Ponsurya L", date: "27/Nov", employeeId: "1114" },
{ name: "Prasanna Kumar", date: "30/Nov", employeeId: "1115" }
]
},
{
id: "37",
title: "Wellness Boot Camp - Bone Density",
date: "December 10, 2025",
location: "",
description: "Bone density check-up for employees.",
type: "Wellness",
registrationOpen: true
},
{
id: "38",
title: "Christmas",
date: "December 24, 2025",
location: "",
description: "Celebrating Christmas with festive activities.",
type: "Holidays/Festivals"
},
{
id: "39",
title: "Christmas at Natesan Park",
date: "December 24, 2025",
location: "Natesan Park",
description: "Christmas celebration at Natesan Park.",
type: "Holidays/Festivals"
},
{
id: "40",
title: "BOM: December Birthdays",
date: "December 31, 2025",
location: "",
description: "Celebrating all December birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Cynthia V", date: "3/Dec", employeeId: "1116" },
{ name: "Gayathri Ganesan", date: "10/Dec", employeeId: "1117" },
{ name: "Shankar Kumar M", date: "19/Dec", employeeId: "1118" },
{ name: "Sridhar J", date: "21/Dec", employeeId: "1119" },
{ name: "Viral Kothari K", date: "26/Dec", employeeId: "1120" },
{ name: "Nithish Kumar C", date: "27/Dec", employeeId: "1121" },
{ name: "Manimaran Venkatachalam", date: "27/Dec", employeeId: "1122" },
{ name: "Thamizharasi Jayagopi", date: "30/Dec", employeeId: "1123" },
{ name: "Vignash M", date: "31/Dec", employeeId: "1124" }
]
},
{
id: "41",
title: "Outdoor Boot Camp",
date: "January 9, 2026",
location: "",
description: "Outdoor fitness boot camp for employees.",
type: "Wellness",
registrationOpen: true
},
{
id: "42",
title: "Pongal",
date: "January 13, 2026",
location: "",
description: "Celebrating the harvest festival of Pongal.",
type: "Holidays/Festivals"
},
{
id: "43",
title: "National Handwriting Day",
date: "January 23, 2026",
location: "",
description: "Handwriting activities for employees.",
type: "Sports/Entertainment",
registrationOpen: true
},
{
id: "44",
title: "BOM: January Birthdays",
date: "January 31, 2026",
location: "",
description: "Celebrating all January birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Valarmathy", date: "1/Jan", employeeId: "1125" },
{ name: "A Sikkanthar Ammal", date: "1/Jan", employeeId: "1126" },
{ name: "Siddhant Kumar", date: "11/Jan", employeeId: "1127" },
{ name: "Praghatiesh S", date: "14/Jan", employeeId: "1128" },
{ name: "Kokila V", date: "22/Jan", employeeId: "1129" },
{ name: "Siva S", date: "31/Jan", employeeId: "1130" }
]
},
{
id: "45",
title: "Session on Relationship Management",
date: "February 6, 2026",
location: "",
description: "Workshop on managing relationships.",
type: "Wellness",
registrationOpen: true
},
{
id: "46",
title: "Valentine's Day",
date: "February 13, 2026",
location: "",
description: "Celebrating Valentine's Day with team activities.",
type: "Holidays/Festivals"
},
{
id: "47",
title: "Dumb Charades",
date: "February 20, 2026",
location: "",
description: "Dumb charades game for employees.",
type: "Sports/Entertainment",
registrationOpen: true
},
{
id: "48",
title: "BOM: February Birthdays",
date: "February 28, 2026",
location: "",
description: "Celebrating all February birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Darshana Pranav", date: "2/Feb", employeeId: "1131" },
{ name: "Shajin R T", date: "5/Feb", employeeId: "1132" },
{ name: "Manikandan Srinivasan", date: "15/Feb", employeeId: "1133" },
{ name: "Vishnu Mohan", date: "18/Feb", employeeId: "1134" },
{ name: "Rakesh Desabathula", date: "18/Feb", employeeId: "1135" },
{ name: "Swathy R", date: "20/Feb", employeeId: "1136" },
{ name: "Anburaj C", date: "22/Feb", employeeId: "1137" }
]
},
{
id: "49",
title: "Indoor Rock Climbing",
date: "March 20, 2026",
location: "",
description: "Indoor rock climbing event for employees.",
type: "Wellness",
registrationOpen: true
},
{
id: "50",
title: "Women's Day",
date: "March 8, 2026",
location: "",
description: "Celebrating Women's Day with special activities.",
type: "Holidays/Festivals"
},
{
id: "51",
title: "Session on Anger Management",
date: "March 27, 2026",
location: "",
description: "Workshop on managing anger.",
type: "Wellness",
registrationOpen: true
},

{
id: "53",
title: "BOM: March Birthdays",
date: "March 31, 2026",
location: "",
description: "Celebrating all March birthdays.",
type: "BOM-Birthdays of the Month",
details: [
{ name: "Sakthidasan E", date: "5/Mar", employeeId: "1138" },
{ name: "Devendran Rajesh K", date: "5/Mar", employeeId: "1139" },
{ name: "Shivam Khanna", date: "5/Mar", employeeId: "1140" },
{ name: "Sridevi S", date: "7/Mar", employeeId: "1141" },
{ name: "Suganya P", date: "7/Mar", employeeId: "1142" },
{ name: "Ankita H", date: "10/Mar", employeeId: "1143" },
{ name: "Nachiyar C", date: "11/Mar", employeeId: "1144" },
{ name: "Sebabrata Ghosh", date: "16/Mar", employeeId: "1145" },
{ name: "Chandrakanth S", date: "17/Mar", employeeId: "1146" },
{ name: "Tharangini Gajendran", date: "17/Mar", employeeId: "1147" },
{ name: "Vijayakumar P", date: "17/Mar", employeeId: "1148" },
{ name: "Selva Kumar T", date: "18/Mar", employeeId: "1149" },
{ name: "Lingeswar P", date: "18/Mar", employeeId: "1150" },
{ name: "Jayasree R", date: "19/Mar", employeeId: "1151" },
{ name: "Kishore N L", date: "19/Mar", employeeId: "1152" },
{ name: "Sivakumar Natarajan", date: "20/Mar", employeeId: "1153" },
{ name: "Kathiravan P", date: "22/Mar", employeeId: "1154" },
{ name: "Nithveen J", date: "22/Mar", employeeId: "1155" },
{ name: "Syed Navassherif S", date: "23/Mar", employeeId: "1156" },
{ name: "Sriram Seshadri", date: "24/Mar", employeeId: "1157" },
{ name: "Gayathri S", date: "24/Mar", employeeId: "1158" },
{ name: "Abubakkar Siddik N", date: "27/Mar", employeeId: "1159" },
{ name: "Siva Rama Krishnan P", date: "28/Mar", employeeId: "1160" },
{ name: "Bijeta Dubey", date: "31/Mar", employeeId: "1161" }
]
},
 {
id: "55",
title: "Emp Engagement: Carrom & Chess Tournament ",
date: "March 15, 2025",
location: "",
description: "Emp Engagement: Carrom & Chess Tournament.",
type: "Holidays/Festivals",
images: [
"/carrom-competition-april-2025/4.jpg",
"/carrom-competition-april-2025/2.jpg",
"/carrom-competition-april-2025/3.jpg",
"/carrom-competition-april-2025/1.jpg",
"/carrom-competition-april-2025/5.jpg",
"/carrom-competition-april-2025/6.jpg",
"/carrom-competition-april-2025/7.jpg",
"/carrom-competition-april-2025/8.jpg"

]
}, 
{
id: "56",
title: "SK Cricket League ",
date: "March 16, 2025",
location: "",
description: "SK Cricket League",
type: "Holidays/Festivals",
images: [
"/skcl2023/1.jpg",
"/skcl2023/2.jpg",
"/skcl2023/3.jpg",
"/skcl2023/4.jpg",
"/skcl2023/5.jpg",
"/skcl2023/6.jpg",
"/skcl2023/7.jpg",
"/skcl2023/8.jpg",
"/skcl2023/9.jpg",
"/skcl2023/10.jpg",


]
},  
{
id: "57",
title: " Independence day 2023 ",
date: "March 16, 2025",
location: "",
description: " Independence day 2023.",
type: "Holidays/Festivals",
images: [
"/Independence-Day-2023/1.png",
"/Independence-Day-2023/2.png",
"/Independence-Day-2023/3.png",
"/Independence-Day-2023/4.png",
"/Independence-Day-2023/5.png",
"/Independence-Day-2023/6.png",
"/Independence-Day-2023/7.jpg",
"/Independence-Day-2023/8.png"

]
},
{
id: "58",
title: " Navratri Celebration, ",
date: "March 16, 2025",
location: "",
description: " Navratri Celebration-2023,.",
type: "Holidays/Festivals",
images: [
  "/Navratri-Celebration-2023/1.jpg",
  "/Navratri-Celebration-2023/2.jpg",
  "/Navratri-Celebration-2023/3.png",
  "/Navratri-Celebration-2023/4.png",
  "/Navratri-Celebration-2023/5.JPG",
  "/Navratri-Celebration-2023/6.jpg",
  "/Navratri-Celebration-2023/7.JPG",
  "/Navratri-Celebration-2023/8.jpg",
  "/Navratri-Celebration-2023/9.jpg",
  "/Navratri-Celebration-2023/10.jpg"
]
},  
{
id: "59",
title: " Onam  ",
date: "March 16, 2025",
location: "",
description: " Onam 2023.",
type: "Holidays/Festivals",
images: [
  "/onam-2023/1.jpg",
  "/onam-2023/2.JPG",
  "/onam-2023/3.JPG",
  "/onam-2023/4.JPG",
  "/onam-2023/5.JPG",
  "/onam-2023/6.JPG",
  "/onam-2023/7.JPG",
  "/onam-2023/8.JPG",
  "/onam-2023/9.JPG",
  "/onam-2023/10.JPG",
  "/onam-2023/11.jpg",
  "/onam-2023/12.jpg"
]
},  
{
id: "60",
title: " Diwali Celebration ",
date: "March 16, 2025",
location: "",
description: " Diwali Celebration_2023.",
type: "Holidays/Festivals",
images: [
  "/Diwali-2023/1.JPG",
  "/Diwali-2023/2.JPG",
  "/Diwali-2023/3.JPG",
  "/Diwali-2023/4.JPG",
  "/Diwali-2023/5.JPG",
  "/Diwali-2023/6.JPG",
  "/Diwali-2023/7.JPG",
  "/Diwali-2023/8.JPG",
  "/Diwali-2023/9.jpg",
  "/Diwali-2023/10.PNG"
]
}, 
{
id: "61",
title: " Halloween 2023  ",
date: "March 16, 2025",
location: "",
description: " Halloween 2023.",
type: "Holidays/Festivals",
images: [
  "/Halloween-2023/1.JPG",
  "/Halloween-2023/2.JPG",
  "/Halloween-2023/3.JPG",
  "/Halloween-2023/4.jpg",
  "/Halloween-2023/5.jpg",
  "/Halloween-2023/6.jpg",
  "/Halloween-2023/7.jpg",
  "/Halloween-2023/8.jpeg",
  "/Halloween-2023/9.jpeg",
  "/Halloween-2023/10.jpeg",
  "/Halloween-2023/11.jpg"
]
},  
{
id: "62",
title: " Christmas Celebration ",
date: "March 16, 2025",
location: "",
description: " Christmas Celebration -2023.",
type: "Holidays/Festivals",
images: [
]
},
{
  id: "71",
  title: "Potluck Celebration 2023",
  date: "November 27, 2023",
  type: "Holidays/Festivals",
  description: "Potluck party photos from the 2023 celebration!",
  images: [
    "/POT-Luck/1.JPG",
    "/POT-Luck/2.JPG",
    "/POT-Luck/3.JPG",
    "/POT-Luck/4.JPG",
    "/POT-Luck/6.JPG",
    "/POT-Luck/7.JPG",
    "/POT-Luck/9.JPG",
    "/POT-Luck/10.jpeg",
    "/POT-Luck/IMG_1353.JPG",
    "/POT-Luck/IMG_1370.JPG",
    "/POT-Luck/IMG_1372.JPG",
    "/POT-Luck/IMG_1373.JPG",
    "/POT-Luck/WhatsApp%20Image%202023-11-27%20at%2010.21.01%20AM.jpeg",
    "/POT-Luck/WhatsApp%20Image%202023-11-27%20at%2010.21.04%20AM%20(3).jpeg",
    "/POT-Luck/WhatsApp%20Image%202023-11-27%20at%2010.21.05%20AM%20(1).jpeg",
    "/POT-Luck/WhatsApp%20Image%202023-11-27%20at%2010.21.05%20AM.jpeg"
  ]
},
{
id: "64",
title: " CSR Activity : ThankU Bakery Stall.   ",
date: "March 16, 2025",
location: "",
description: " CSR Activity Jun 2023: ThankU Bakery Stall.",
type: "Holidays/Festivals",
images: [
"/CSR-Activity-2023/1.jpg",
"/CSR-Activity-2023/2.jpg",
"/CSR-Activity-2023/3.jpg",
"/CSR-Activity-2023/4.jpg",
"/CSR-Activity-2023/5.jpg",
"/CSR-Activity-2023/6.jpg",

]
}, 
{
id: "65",
title: " Fire Mock Drill  ",
date: "March 16, 2025",
location: "",
description: " Fire Mock Drill, .",
type: "Holidays/Festivals",
images: [
  "/Fire-Mock-Drill-2023/1.png",
  "/Fire-Mock-Drill-2023/2.png",
  "/Fire-Mock-Drill-2023/3.png",
  "/Fire-Mock-Drill-2023/4.png",
  "/Fire-Mock-Drill-2023/5.png",
  "/Fire-Mock-Drill-2023/6.png",
  "/Fire-Mock-Drill-2023/7.png",
  "/Fire-Mock-Drill-2023/8.png",
  "/Fire-Mock-Drill-2023/9.png",
  "/Fire-Mock-Drill-2023/10.png"
]

}, 
{
id: "70",
title: " welfare camp Bone Desity Checkup   ",
date: "March 16, 2024",
location: "",
description: "welfare camp Bone Desity Checkup 2024 , .",
type: "Holidays/Festivals",
images: [
"/welfare-camp-Bone-Desity-Checkup-2024/1.png",
"/welfare-camp-Bone-Desity-Checkup-2024/2.jpg",
"/welfare-camp-Bone-Desity-Checkup-2024/3.jpg",
"/welfare-camp-Bone-Desity-Checkup-2024/4.jpg",
"/welfare-camp-Bone-Desity-Checkup-2024/5.jpg",
"/welfare-camp-Bone-Desity-Checkup-2024/6.jpg",
"/welfare-camp-Bone-Desity-Checkup-2024/7.jpg",
"/welfare-camp-Bone-Desity-Checkup-2024/8.jpg",
"/welfare-camp-Bone-Desity-Checkup-2024/9.jpg",
"/welfare-camp-Bone-Desity-Checkup-2024/10.jpeg",

]
}, 

{
id: "66",
title: " Wellness Camp: Eye checkup Camp   ",
date: "March 16, 2025",
location: "",
description: "  Wellness Camp: Eye checkup Camp 2023, .",
type: "Holidays/Festivals",
images: [
"/Welfare-camp-Eyecheckup-Camp-2023/1.jpg",
"/Welfare-camp-Eyecheckup-Camp-2023/2.jpg",
"/Welfare-camp-Eyecheckup-Camp-2023/3.jpg",
"/Welfare-camp-Eyecheckup-Camp-2023/4.jpg",
"/Welfare-camp-Eyecheckup-Camp-2023/5.png",
"/Welfare-camp-Eyecheckup-Camp-2023/6.jpg",
"/Welfare-camp-Eyecheckup-Camp-2023/7.jpg",
"/Welfare-camp-Eyecheckup-Camp-2023/8.jpg",
"/Welfare-camp-Eyecheckup-Camp-2023/9.jpg",
"/Welfare-camp-Eyecheckup-Camp-2023/10.jpg",
"/Welfare-camp-Eyecheckup-Camp-2023/11.jpg",
]
}, 
{
  id: "67",
  title: "Pongal",
  date: "January 14 2025",
  description: "Celebrating the harvest festival of Pongal.",
  type: "Holidays/Festivals",
  folder: "past-events/pongal2023",
  imageCount: 20 // 👈 total images inside that folder
},
];
