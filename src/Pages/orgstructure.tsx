import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, User, Users, Upload, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import * as XLSX from 'xlsx';
import API from "@/config";

// Enhanced role detection matching the org chart structure
const detectRoleHierarchy = (roleText: string, department: string): { level: string, title: string } => {
  let role = roleText.toLowerCase().trim();

  // normalize "TEAM MEMBER - ..." style
  role = role.replace(/team\s*member\s*-/i, '').replace(/team\s*member/i, '').trim();

  // CEO and C-level
  if (role === 'ceo' || role === 'ceo office' || role.startsWith('ceo ') || role === 'ceo & chairman') {
    return { level: 'CEO', title: roleText };
  }
  if (role.includes('director&operations') || role.includes('director operations')) {
    return { level: 'DIRECTOR & OPERATIONS', title: 'Director&operations' };
  }
  if (role.includes('cdo') || role.includes('people & culture')) {
    return { level: 'CDO / Head-People & Culture', title: 'CDO/people & culture' };
  }
  if (role === 'cfo') {
    return { level: 'CFO', title: 'CFO' };
  }
  if (role.includes('cro') || role.includes('wtd')) {
    return { level: 'CRO/WTD', title: 'CRO/WTD' };
  }
  if (role.includes('director') && role.includes('delivery')) {
    return { level: 'DEPT_DIRECTOR', title: 'Director-Delivery-CMS' };
  }
  if (role.includes('senior manager') || role.includes('sr manager')) {
    return { level: 'SENIOR_MANAGER', title: roleText };
  }
  if (role.includes('vp ')) {
    return { level: 'VP', title: roleText };
  }
  if (role.includes('finance manager') && !role.includes('team member')) {
    return { level: 'Finance Manager', title: roleText };
  }
  if (role.includes('company secretary') || role === 'cs') {
    return { level: 'Company Secretary', title: 'Company Secretary' };
  }

  // role map
  const roleMap: Record<string, { level: string; title: string }> = {
    "hr": { level: "HR", title: "HR" },
    "finance": { level: "FINANCE", title: "Finance" },
    "bda": { level: "BDA", title: "Business Development Associate" },
    "it admin": { level: "IT_ADMIN", title: "Associate Manager - I.T. Opertions" },
    "iam": { level: "IAM", title: "Head of IAM" },
    "sales": { level: "SALES", title: "Sales" },
    "marketing": { level: "MARKETING", title: "Marketing" },
    "ta": { level: "TA", title: "Talent Acquisition" },
    "admin": { level: "ADMIN", title: "Admin" },
    "t a": { level: "TA", title: "Talent Acquisition" }
  };

  if (roleMap[role]) {
    return roleMap[role];
  }

  return { level: 'TEAM_MEMBER', title: roleText };
};

const normalizeExcelData = (excelData: any[]): any[] => {
  return excelData.map((row) => {
    const lowerRow: any = {};
    Object.keys(row).forEach(key => {
      lowerRow[key.trim().toLowerCase()] = row[key];
    });

    const rawRole = (lowerRow["role"] || "").toString().trim();
    const department = (lowerRow["department"] || "").toString()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim();

    const hierarchy = detectRoleHierarchy(rawRole, department);

    return {
      id: lowerRow["emp id"]?.toString().trim() || `temp-${Math.random()}`,
      name: lowerRow["associate name"]?.toString().trim(),
     title: rawRole,            
      email: lowerRow["email"]?.toString().trim(),
      phone: lowerRow["phone no"]?.toString().trim(),
      department,
      subTeam: lowerRow["sub team"]?.toString().trim() || "General",
      role: hierarchy.level,
      hierarchyTitle: hierarchy.title, 
      reportingManager: lowerRow["reporting manager"]?.toString().trim() || "",
    };
  });
};

interface Person {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  children?: Person[];  // NEW: Support for nested reports
}

interface Team {
  id: string;
  name: string;
  color: string;
  members: Person[];
}

interface DepartmentSection {
  id: string;
  name: string;
  head: Person;
  color: string;
  subTeams: Team[];
}

interface ExecutiveBranch {
  id: string;
  executive: Person;
  color: string;
  departments: DepartmentSection[];
}

interface OrgStructure {
  ceo: Person;
  seniorEA: Person;
  branches: ExecutiveBranch[];
}

const OrgChart = () => {

  const [orgData, setOrgData] = useState<OrgStructure | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set());
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  const getDefaultOrgData = (): OrgStructure => ({
    ceo: {
      id: 'ceo',
      name: 'Suresh V',
      title: 'CEO',
      email: '',
      phone: ''
    },
    seniorEA: {
      id: 'senior-ea',
      name: 'Hemamalini K',
      title: 'Senior EA',
      email: '',
      phone: ''
    },
    branches: []
  });
    // 🔐 Admin visibility (same logic as sidebar)
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined") {
        const parsed = JSON.parse(raw);
        const role = parsed?.role || "user";
        setIsAdmin(role === "admin");
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }
  }, []);


  useEffect(() => {
    loadOrgData();
  }, []);
const loadOrgData = async () => {
  try {
    setIsLoading(true);
    setUploadStatus("Loading organization data...");

    // 🔹 Fetch saved organization data from backend
    const response = await fetch(`${API}/api/org/structure`);

    if (response.ok) {
      const data = await response.json();
      const validatedData = validateOrgStructure(data);
      setOrgData(validatedData);
      setUploadStatus("Loaded organization structure from server");
    } else if (response.status === 404) {
      // No stored org data yet → show default
      const defaultData = getDefaultOrgData();
      setOrgData(defaultData);
      setUploadStatus("No saved org data found. Please upload an Excel file.");
    } else {
      // Server error
      const defaultData = getDefaultOrgData();
      setOrgData(defaultData);
      setUploadStatus(`Server error (${response.status}). Showing default data.`);
    }
  } catch (error) {
    console.error("Failed to load org structure:", error);
    const defaultData = getDefaultOrgData();
    setOrgData(defaultData);
    setUploadStatus("Connection error – showing default data.");
  } finally {
    setIsLoading(false);
  }
};


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setUploadStatus('Reading Excel file...');

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      if (!excelData || excelData.length === 0) {
        throw new Error('Excel file is empty or invalid');
      }

      setUploadStatus('Processing organizational hierarchy...');
      const normalizedData = normalizeExcelData(excelData);

      setUploadStatus('Saving to database...');
      const response = await fetch(`${API}/api/org/structure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeData: normalizedData }),
      });

      if (response.ok) {
        const transformedData = await response.json();
        if (transformedData && typeof transformedData === 'object') {
          const validatedData = validateOrgStructure(transformedData);
          setOrgData(validatedData);
          setUploadStatus(`Successfully processed ${excelData.length} employees!`);
        } else {
          throw new Error('Invalid response from server');
        }

        // Reset expansions
        setExpandedBranches(new Set());
        setExpandedDepartments(new Set());
        setExpandedTeams(new Set());
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to save: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  // Helper function to validate org structure
  const validateOrgStructure = (data: any): OrgStructure => {
    const defaultData = getDefaultOrgData();
    return {
      ceo: data.ceo || defaultData.ceo,
      seniorEA: data.seniorEA || defaultData.seniorEA,
      branches: Array.isArray(data.branches) ? data.branches : defaultData.branches
    };
  };

  const toggleExpansion = (type: 'branch' | 'department' | 'team', id: string) => {
    const setters = {
      branch: setExpandedBranches,
      department: setExpandedDepartments,
      team: setExpandedTeams
    };

    const current = {
      branch: expandedBranches,
      department: expandedDepartments,
      team: expandedTeams
    };

    const newSet = new Set(current[type]);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setters[type](newSet);
  };

  const expandAll = () => {
    if (!orgData || !orgData.branches) return;

    setExpandedBranches(new Set(orgData.branches.map(b => b.id)));
    setExpandedDepartments(new Set(
      orgData.branches.flatMap(b =>
        (b.departments || []).map(d => d.id)
      )
    ));
    setExpandedTeams(new Set(
      orgData.branches.flatMap(b =>
        (b.departments || []).flatMap(d => (d.subTeams || []).map(t => t.id))
      )
    ));
  };

  const collapseAll = () => {
    setExpandedBranches(new Set());
    setExpandedDepartments(new Set());
    setExpandedTeams(new Set());
  };

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading organization structure...</p>
          {uploadStatus && <p className="text-sm text-gray-500 mt-2">{uploadStatus}</p>}
        </div>
      </div>
    );
  }

  // Early return if no data (should never happen now)
  if (!orgData) {
    return (
      <div className="max-w-7xl mx-auto text-center py-20">
        <p className="text-gray-600">No organization data available</p>
        <button onClick={loadOrgData} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Retry Loading
        </button>
      </div>
    );
  }

    // Ensure branches is always an array
  const branches = Array.isArray(orgData.branches) ? orgData.branches : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4">
      {/* Upload Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Organization Structure
        </h2>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          {/* 🔐 Upload Excel – only for admins */}
          {isAdmin && (
            <>
              <label
                htmlFor="excel-upload"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>{isLoading ? "Processing..." : "Upload Excel File"}</span>
              </label>

              <input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
            </>
          )}

          {/* Visible for everyone */}
        

          <button
            onClick={expandAll}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Expand All
          </button>

          <button
            onClick={collapseAll}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Collapse All
          </button>
        </div>

        {uploadStatus && (
          <div
            className={`p-3 rounded-lg ${
              uploadStatus.includes("Error")
                ? "bg-red-100 text-red-700"
                : uploadStatus.includes("Successfully")
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {uploadStatus}
          </div>
        )}
      </div>

      {/* CEO Level */}
      <div className="flex justify-center">
        <Card className="p-6 bg-blue-600 text-white shadow-xl rounded-lg">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold">{orgData.ceo?.name || "CEO"}</h3>
              <p className="text-white opacity-90">
                {orgData.ceo?.title || "Chief Executive Officer"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Senior EA - positioned to the right */}
      <div className="flex justify-end pr-16">
        <Card className="p-4 bg-teal-600 text-white shadow-lg rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-teal-600" />
            </div>
            <div className="text-center">
              <h4 className="font-bold">
                {orgData.seniorEA?.name || "Senior EA"}
              </h4>
              <p className="text-xs text-white opacity-90">
                {orgData.seniorEA?.title || "Senior Executive Assistant"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Executive Branches - Orange level */}
      <div className="flex flex-row flex-wrap gap-4 mt-8">
        {branches.map((branch) => (
          <div key={branch.id} className="space-y-2 w-[260px]">
            {/* Executive Card - Orange */}
            <Card
              className={`p-4 ${
                branch.color || "bg-orange-500"
              } text-white shadow-lg rounded-lg cursor-pointer hover:shadow-xl transition-all transform hover:scale-105`}
              onClick={() => toggleExpansion("branch", branch.id)}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-600" />
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-sm">
                    {branch.executive?.name || "Executive"}
                  </h4>
                  <p className="text-xs opacity-90">
                    {branch.executive?.title ||
                      (branch.executive as any)?.hierarchyTitle ||
                      "Executive"}
                  </p>
                  <p className="text-xs mt-1 opacity-75">
                    {(branch.departments || []).length} departments
                  </p>
                </div>

                <div className="text-white">
                  {expandedBranches.has(branch.id) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </Card>

            {/* Departments under this executive - Blue level */}
            {expandedBranches.has(branch.id) && (
              <div className="space-y-3 ml-2">
                {(branch.departments || []).map((dept) => (
                  <DepartmentCard
                    key={dept.id}
                    department={dept}
                    isExpanded={expandedDepartments.has(dept.id)}
                    onToggle={() => toggleExpansion("department", dept.id)}
                    expandedTeams={expandedTeams}
                    onTeamToggle={(id) => toggleExpansion("team", id)}
                  />
                ))}

                {(!branch.departments || branch.departments.length === 0) && (
                  <Card className="p-3 bg-gray-100 border-l-4 border-l-gray-400 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                      No departments found
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>
        ))}

        {branches.length === 0 && (
          <div className="w-full text-center py-8">
            <p className="text-gray-600">
              No executive branches found. Please upload employee data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


interface DepartmentCardProps {
  department: DepartmentSection;
  isExpanded: boolean;
  onToggle: () => void;
  expandedTeams: Set<string>;
  onTeamToggle: (teamId: string) => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  isExpanded,
  onToggle,
  expandedTeams,
  onTeamToggle
}) => {
  if (!department) return null;

  const subTeams = Array.isArray(department.subTeams) ? department.subTeams : [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border">
      {/* Department Head - Blue level */}
      <div className="bg-blue-600 text-white p-3 cursor-pointer hover:bg-blue-700 transition-colors" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <div>
          
<h5 className="font-bold text-sm">
  {department.head?.name && department.head.name !== "TBD"
    ? department.head.name
    : department.name}
</h5>
<p className="text-xs opacity-90">
  {department.head?.title && department.head.name !== "TBD"
    ? department.head.title
    : `Department of ${department.name}`}
</p>



            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">
              {subTeams.reduce((count, t) => count + (t.members?.length || 0), 0)} members
            </span>

            {subTeams.length > 0 && (
              <div>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Members directly under department (skip sub-team level) */}
      {isExpanded && (
        <div className="p-3 space-y-2 bg-gray-50">
          {subTeams.flatMap(team => team.members).map((member) => (
            <MemberCard key={member.id} member={member} color="bg-purple-600" />
          ))}

          {subTeams.flatMap(team => team.members).length === 0 && (
            <p className="text-sm text-gray-500 text-center py-2">No members found</p>
          )}
        </div>
      )}
    </div>
  );
};

interface TeamCardProps {
  team: Team;
  isExpanded: boolean;
  onToggle: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, isExpanded, onToggle }) => {
  if (!team) return null;

  const members = Array.isArray(team.members) ? team.members : [];

  return (
    <div className="bg-white rounded border shadow-sm">
      <div className={`${team.color || 'bg-purple-600'} text-white p-2 cursor-pointer hover:opacity-90 transition-opacity`} onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-3 h-3" />
            <span className="text-sm font-medium">{team.name || 'Team'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">{members.length} members</span>
            {members.length > 0 && (
              <div>{isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && members.length > 0 && (
        <div className="p-2 space-y-1 max-h-48 overflow-y-auto bg-gray-50">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} color={team.color || 'bg-purple-600'} />
          ))}
        </div>
      )}
    </div>
  );
};

// NEW: Recursive MemberCard for nested rendering
interface MemberCardProps {
  member: Person;
  color: string;
  depth?: number;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, color, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = member.children && member.children.length > 0;
  const memberCount = hasChildren ? member.children.length : 0;

  return (
    <div style={{ marginLeft: `${depth * 16}px` }} className="mt-1">
      <div
        className="flex items-center space-x-2 p-2 bg-white rounded text-sm shadow-sm hover:bg-gray-100 transition cursor-pointer"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <div className={`w-6 h-6 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
          <User className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{member.name || 'Unknown'}</p>
         <p className="text-xs text-gray-600 truncate">
  {member.title}   {/* Always show Excel role */}
</p>


          {hasChildren && (
            <p className="text-xs text-gray-500 truncate">{memberCount} members</p>
          )}
          {member.email && (
            <p className="text-xs text-gray-500 truncate">{member.email}</p>
          )}
        </div>
        {hasChildren && (
          <div>{isExpanded ? <ChevronUp className="w-3 h-3 text-gray-600" /> : <ChevronDown className="w-3 h-3 text-gray-600" />}</div>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div className="space-y-1">
          {member.children.map((child) => (
            <MemberCard key={child.id} member={child} color={color} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgChart;
