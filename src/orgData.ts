
export interface OrgNode {
  name: string;
  title: string;
  children?: OrgNode[];
}

export const orgChartData: OrgNode = {
  name: "Suresh Venkatachari",
  title: "CEO & CHAIRMAN",
  children: [
    { name: "Hemamalini", title: "Senior E.A" },
    {
      name: "Murali",
      title: "Director - Operations",
      children: [
        { name: "IT", title: "IT" },
        { name: "Admin", title: "Admin" }
      ]
    },
    {
      name: "Ramachandran S",
      title: "CFO",
      children: [
        { name: "Finance Team", title: "Finance Team" },
        { name: "Jayshree", title: "CS" }
      ]
    },
    {
      name: "Siva Kumar",
      title: "CDO / Head - People & Culture",
      children: [
        { name: "TA Team", title: "TA Team" },
        { name: "HR Team", title: "HR Team" }
      ]
    },
    {
      name: "Venkateswaran K",
      title: "CRO / WTD"
    },
    {
      name: "Sriram Seshadri",
      title: "Director - Delivery (CMS)",
      children: [
        { name: "Cloud Transformation", title: "Cloud Transformation" },
        { name: "Cloud Managed Services", title: "Cloud Managed Services" },
        { name: "CoE Cloud", title: "CoE Cloud" }
      ]
    },
    {
      name: "Jayakumar",
      title: "Director - Bigdata & Analytics",
      children: [
        { name: "Data & AI", title: "Data & AI" },
        { name: "Application Modernization", title: "Application Modernization" },
        { name: "CADP", title: "CADP" },
        { name: "CoE AI", title: "CoE AI" }
      ]
    },
    {
      name: "TBH",
      title: "Director - Marketing",
      children: [
        { name: "Marketing Team", title: "Marketing Team" }
      ]
    },
    {
      name: "Roy",
      title: "RSM (APAC) – Singapore",
      children: [
        { name: "RSM MEA - Dubai (TBH)", title: "RSM MEA" },
        { name: "Channel Manager (TBH)", title: "Channel Manager" }
      ]
    },
    {
      name: "Sabin Kumar Gupta",
      title: "VP Sales India",
      children: [
        { name: "Regional Sales", title: "Regional Sales" },
        { name: "Inside Sales", title: "Inside Sales" }
      ]
    },
    {
      name: "Darshana Pranav",
      title: "Sr. Manager – IT Staffing",
      children: [
        { name: "Recruiting Team", title: "Recruiting Team" }
      ]
    },
    {
      name: "Ramesh Sampath",
      title: "Sr. Manager – IT Staffing",
      children: [
        { name: "IT Staffing Sales", title: "IT Staffing Sales" }
      ]
    }
  ]
};
