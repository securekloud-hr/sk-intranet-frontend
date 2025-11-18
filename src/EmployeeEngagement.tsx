import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy, Heart } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'Wellness' | 'Holidays/Festivals' | 'Sports/Entertainment' | 'BOM-Birthdays of the Month';
  registrationOpen?: boolean;
  images?: string[];
  details?: { name: string; date: string }[];
}

const EmployeeEngagement = () => {
  const today = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= today);
  const pastEvents = events.filter(event => new Date(event.date) < today);

  const [activeSection, setActiveSection] = useState('upcoming');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPastEvent, setSelectedPastEvent] = useState<Event | null>(null);
  const [selectedBomEvent, setSelectedBomEvent] = useState<Event | null>(null);

  const filteredEvents = activeSection === 'upcoming'
    ? activeCategory === 'all'
      ? upcomingEvents
      : upcomingEvents.filter(event => event.type === activeCategory)
    : pastEvents;

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
                const selected = pastEvents.find(ev => ev.id === selectedEventId);
                setSelectedPastEvent(selected || null);
              }}
            >
              <option value="">-- Select a past event --</option>
              {pastEvents.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title} ({event.date})
                </option>
              ))}
            </select>
            {selectedPastEvent && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">{selectedPastEvent.title} Photos</h3>
                {selectedPastEvent.images ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedPastEvent.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Event ${index + 1}`}
                        className="w-full h-48 object-cover rounded shadow"
                      />
                    ))}
                  </div>
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {selectedBomEvent.details.map((bd, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border p-2">{bd.name}</td>
                  <td className="border p-2">{bd.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
  const getBadgeVariant = (type: string) => {
    switch(type) {
      case 'Wellness': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'Holidays/Festivals': return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'Sports/Entertainment': return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'BOM-Birthdays of the Month': return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default: return "";
    }
  };

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'Wellness': return Heart;
      case 'Holidays/Festivals': return Calendar;
      case 'Sports/Entertainment': return Trophy;
      case 'BOM-Birthdays of the Month': return Users;
      default: return Calendar;
    }
  };

  const EventIcon = getEventIcon(event.type);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <Badge className={getBadgeVariant(event.type)}>{event.type}</Badge>
          {event.registrationOpen && (
            <Badge variant="outline" className="bg-green-50 text-green-800">Registration Open</Badge>
          )}
        </div>
        <div className="mt-3 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center mt-1">
            <EventIcon className="h-5 w-5 text-securekloud-700" />
          </div>
          <div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.date} {event.location && `at ${event.location}`}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
        <Button
          className="w-full"
          onClick={() => {
            if (event.type === 'BOM-Birthdays of the Month') {
              console.log("Attempting to show:", event.title, event.details);
              onViewDetails(event);
            }
          }}
        >
          {event.registrationOpen ? "Register Now" : "View Details"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmployeeEngagement;

const events: Event[] = [
 {
id: "1",
title: "Life Balance on Work-from-Home Session",
date: "April 10, 2025",
location: "",
description: "Session on maintaining work-life balance while working from home.",
type: "Wellness",
registrationOpen: true
},
{
id: "2",
title: "Tamil New Year's Day",
date: "April 15, 2025",
location: "",
description: "Celebration of the traditional Tamil New Year.",
type: "Holidays/Festivals",
images: [
"/carrom-competition-april-2025/4.jpg",
"/carrom-competition-april-2025/2.jpg",
"/carrom-competition-april-2025/3.jpg",
"/carrom-competition-april-2025/1.jpg"
]
},
{
id: "3",
title: "Carrom Competition",
date: "April 18, 2025",
location: "",
description: "Carrom tournament for employees.",
type: "Sports/Entertainment",
registrationOpen: true,
images: [
"/carrom-competition-april-2025/4.jpg",
"/carrom-competition-april-2025/2.jpg",
"/carrom-competition-april-2025/3.jpg"
]
},
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
id: "5",
title: "Yoga Session",
date: "May 23, 2025",
location: "",
description: "Yoga session for employee wellness.",
type: "Wellness",
registrationOpen: true
},
{
id: "6",
title: "Summer Kickoff Day",
date: "May 2, 2025",
location: "",
description: "Celebrating the start of summer with fun activities.",
type: "Holidays/Festivals"
},
{
id: "7",
title: "Chess Competition",
date: "May 16, 2025",
location: "",
description: "Chess tournament for employees.",
type: "Sports/Entertainment",
registrationOpen: true
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
id: "9",
title: "Wellness Boot Camp",
date: "June 18, 2025",
location: "",
description: "General health check-up for employees.",
type: "Wellness",
registrationOpen: true
},
{
id: "10",
title: "Leave the Office Early Day",
date: "June 2, 2025",
location: "",
description: "Employees can leave early to enjoy the day.",
type: "Holidays/Festivals"
},
{
id: "11",
title: "Outdoor Cricket Tournament",
date: "June 14, 2025",
location: "",
description: "Cricket tournament for employees.",
type: "Sports/Entertainment",
registrationOpen: true
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
{ name: "Jayakumar Karuppasamy", date: "21/Jun", employeeId: "1048" },
{ name: "Dharanitharan Murugan", date: "21/Jun", employeeId: "1049" },
{ name: "Magalakshmi M", date: "22/Jun", employeeId: "1050" },
{ name: "Sowmiya R", date: "26/Jun", employeeId: "1051" },
{ name: "Shanmugavel S", date: "28/Jun", employeeId: "1052" },
{ name: "Hariwasa S", date: "29/Jun", employeeId: "1053" },
{ name: "Vaitheeshwaran J", date: "30/Jun", employeeId: "1054" }
]
},
{
id: "13",
title: "Session on Values & Clarity in Life",
date: "July 18, 2025",
location: "",
description: "Workshop on personal values and clarity.",
type: "Wellness",
registrationOpen: true
},
{
id: "14",
title: "Fitness Session",
date: "July 1, 2025",
location: "",
description: "Fitness activities for employees.",
type: "Holidays/Festivals"
},
{
id: "15",
title: "World Chocolate Day",
date: "July 7, 2025",
location: "",
description: "Celebrating World Chocolate Day with treats.",
type: "Holidays/Festivals"
},
{
id: "16",
title: "Int'l Joke Day",
date: "July 1, 2025",
location: "",
description: "Sharing jokes to lighten the mood.",
type: "Holidays/Festivals"
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
{ name: "Krishnakumar V", date: "10/Oct", employeeId: "1093" },
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
}
];
