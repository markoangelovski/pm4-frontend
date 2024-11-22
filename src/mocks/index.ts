// Types

import { Project, User, Task, Day } from "@/types";

// Mock Data

export const user: User = {
  id: "1c3e6b5e-2f3b-4c8b-9c2a-dc6c1e36dfd0",
  email: "user@example.com",
  password: "hashedpassword123",
  createdAt: new Date("2023-11-01T08:30:00Z"),
  updatedAt: new Date("2023-11-10T10:45:00Z"),
  emailMd5: "4c5bde74cdd0fb85d3d6b3b0df2cf62b"
};

export const projects: Project[] = [
  {
    id: "ed2a7b33-6d4b-4c92-810f-a1b37cd3ea3f",
    title: "Website Redesign",
    description: "Revamping the corporate website to improve user experience.",
    pl: "John Doe",
    upcomingTasks: 2,
    inProgressTasks: 1,
    doneTasks: 2,
    createdAt: new Date("2023-11-01T09:00:00Z"),
    updatedAt: new Date("2023-11-10T15:20:00Z")
  },
  {
    id: "91ae7f89-c6f4-4be1-8054-cb5e5dbce5a6",
    title: "Mobile App Development",
    description: "Creating a mobile app to accompany the website.",
    pl: "Jane Doe",
    upcomingTasks: 1,
    inProgressTasks: 1,
    doneTasks: 1,
    createdAt: new Date("2023-11-02T10:00:00Z"),
    updatedAt: new Date("2023-11-10T11:15:00Z")
  },
  {
    id: "47c49be7-f2eb-4aef-b3e6-9020d8b5d4ad",
    title: "Marketing Campaign",
    description: "Launching a new digital marketing campaign.",
    pl: "Bob Doe",
    upcomingTasks: 1,
    inProgressTasks: 1,
    doneTasks: 1,
    createdAt: new Date("2023-11-03T12:00:00Z"),
    updatedAt: new Date("2023-11-09T18:00:00Z")
  }
];

export const tasks: Task[] = [
  {
    id: "51a1f92c-334b-4af9-89f4-d3029f8b8a7a",
    projectId: "ed2a7b33-6d4b-4c92-810f-a1b37cd3ea3f",
    title: "Research UX best practices",
    description: "Conduct research on user experience best practices.",
    pl: "High",
    createdAt: new Date("2023-11-02T11:30:00Z"),
    updatedAt: new Date("2023-11-03T13:15:00Z"),
    status: "done",
    jiraLink: "https://jira.example.com/UX-101",
    dueDate: new Date("2023-11-05T23:59:59Z"),
    notes: [
      {
        id: "84b6e8c9-4e9a-42a1-bdd2-4a1a7f9f91e5",
        taskId: "51a1f92c-334b-4af9-89f4-d3029f8b8a7a",
        content: "Explored UX best practices for web applications.",
        createdAt: new Date("2023-11-02T14:20:00Z"),
        updatedAt: new Date("2023-11-02T14:20:00Z")
      },
      {
        id: "f47df5e4-8960-48a6-9dc4-49b6d5c5d13f",
        taskId: "51a1f92c-334b-4af9-89f4-d3029f8b8a7a",
        content: "Collected data from popular design forums.",
        createdAt: new Date("2023-11-02T15:10:00Z"),
        updatedAt: new Date("2023-11-02T15:10:00Z")
      }
    ]
  },
  {
    id: "b394f88e-e743-46ff-80ff-4995b45be7a7",
    projectId: "91ae7f89-c6f4-4be1-8054-cb5e5dbce5a6",
    title: "Design App UI",
    description: "Sketch the UI for the mobile app.",
    pl: "High",
    createdAt: new Date("2023-11-04T14:00:00Z"),
    updatedAt: new Date("2023-11-06T10:30:00Z"),
    status: "done",
    jiraLink: "https://jira.example.com/MOB-101",
    dueDate: new Date("2023-11-08T23:59:59Z"),
    notes: [
      {
        id: "b394f88e-e743-46ff-80ff-4995b45be7a7",
        taskId: "51a1f92c-334b-4af9-89f4-d3029f8b8a7a",
        content: "Completed first draft of UI screens.",
        createdAt: new Date("2023-11-05T10:00:00Z"),
        updatedAt: new Date("2023-11-05T10:00:00Z")
      },
      {
        id: "db71ef89-8131-45d9-b5a7-b362df3b2c4f",
        taskId: "b394f88e-e743-46ff-80ff-4995b45be7a7",
        content: "Incorporated feedback from the design review.",
        createdAt: new Date("2023-11-06T09:30:00Z"),
        updatedAt: new Date("2023-11-06T09:30:00Z")
      }
    ]
  },
  {
    id: "6fd2f2ea-fbcb-49d8-ae83-d6cbf5b6e51e",
    projectId: "91ae7f89-c6f4-4be1-8054-cb5e5dbce5a6",
    title: "Implement App Backend",
    description: "Develop the backend API for mobile app data handling.",
    pl: "Medium",
    createdAt: new Date("2023-11-07T08:00:00Z"),
    updatedAt: new Date("2023-11-08T12:30:00Z"),
    status: "in-progress",
    jiraLink: "https://jira.example.com/MOB-102",
    dueDate: new Date("2023-11-15T23:59:59Z"),
    notes: [
      {
        id: "acf4eb2f-cfc6-44b2-8d58-e2ef2c7383d4",
        taskId: "6fd2f2ea-fbcb-49d8-ae83-d6cbf5b6e51e",
        content: "Set up API server and endpoints.",
        createdAt: new Date("2023-11-07T10:00:00Z"),
        updatedAt: new Date("2023-11-07T10:00:00Z")
      },
      {
        id: "fae73b8a-1e9a-404a-bf8e-3a2d28f3ff6b",
        taskId: "6fd2f2ea-fbcb-49d8-ae83-d6cbf5b6e51e",
        content: "Integrated with database.",
        createdAt: new Date("2023-11-08T11:45:00Z"),
        updatedAt: new Date("2023-11-08T11:45:00Z")
      }
    ]
  },
  {
    id: "58fa984f-ecf8-4291-89ff-7f56c6c8f9cd",
    projectId: "47c49be7-f2eb-4aef-b3e6-9020d8b5d4ad",
    title: "Design Social Media Ads",
    description: "Create eye-catching ad designs for social media platforms.",
    pl: "High",
    createdAt: new Date("2023-11-04T09:00:00Z"),
    updatedAt: new Date("2023-11-07T17:30:00Z"),
    status: "upcoming",
    jiraLink: "https://jira.example.com/MKT-201",
    dueDate: new Date("2023-11-10T23:59:59Z"),
    notes: [
      {
        id: "7b865482-16d9-43e5-8584-12df5e34c1a2",
        taskId: "58fa984f-ecf8-4291-89ff-7f56c6c8f9cd",
        content: "Initial design concepts reviewed.",
        createdAt: new Date("2023-11-05T14:30:00Z"),
        updatedAt: new Date("2023-11-05T14:30:00Z")
      },
      {
        id: "eb8d90cb-3768-42d4-92af-e61c8b8e4d5b",
        taskId: "58fa984f-ecf8-4291-89ff-7f56c6c8f9cd",
        content: "Final designs approved by the marketing team.",
        createdAt: new Date("2023-11-07T17:00:00Z"),
        updatedAt: new Date("2023-11-07T17:00:00Z")
      }
    ]
  },
  {
    id: "13b5d142-6f7e-4cbe-bc7f-7c3b25b9c134",
    projectId: "ed2a7b33-6d4b-4c92-810f-a1b37cd3ea3f",
    title: "Prepare Wireframes for Dashboard",
    description:
      "Design and finalize wireframes for the application dashboard.",
    pl: "Medium",
    createdAt: new Date("2023-11-03T10:00:00Z"),
    updatedAt: new Date("2023-11-03T18:30:00Z"),
    status: "in-progress",
    jiraLink: "https://jira.example.com/WIRE-202",
    dueDate: new Date("2023-11-07T23:59:59Z"),
    notes: [
      {
        id: "245a8cb3-f923-4c5e-bd65-fb3a0f9f5e34",
        taskId: "13b5d142-6f7e-4cbe-bc7f-7c3b25b9c134",
        content: "Drafted initial layouts for key dashboard elements.",
        createdAt: new Date("2023-11-03T11:30:00Z"),
        updatedAt: new Date("2023-11-03T11:30:00Z")
      },
      {
        id: "d92d02c1-8bdf-4823-83bc-b76e8c4e123e",
        taskId: "13b5d142-6f7e-4cbe-bc7f-7c3b25b9c134",
        content: "Added interactive elements to wireframes.",
        createdAt: new Date("2023-11-03T16:00:00Z"),
        updatedAt: new Date("2023-11-03T16:00:00Z")
      }
    ]
  },
  {
    id: "3fa4d8e6-4b9c-4af7-9d41-2b69e8b3f6c1",
    projectId: "ed2a7b33-6d4b-4c92-810f-a1b37cd3ea3f",
    title: "Set Up Automated Testing Framework",
    description: "Integrate automated testing tools for front-end components.",
    pl: "High",
    createdAt: new Date("2023-11-04T08:45:00Z"),
    updatedAt: new Date("2023-11-04T15:20:00Z"),
    status: "in-progress",
    jiraLink: "https://jira.example.com/AUTO-303",
    dueDate: new Date("2023-11-10T23:59:59Z"),
    notes: [
      {
        id: "e37fa1b8-428f-4f62-9485-26c7a3b81bfa",
        taskId: "3fa4d8e6-4b9c-4af7-9d41-2b69e8b3f6c1",
        content: "Researched suitable frameworks for testing.",
        createdAt: new Date("2023-11-04T09:30:00Z"),
        updatedAt: new Date("2023-11-04T09:30:00Z")
      },
      {
        id: "f81c8b5d-fc18-4b32-a719-d87b9d72d135",
        taskId: "3fa4d8e6-4b9c-4af7-9d41-2b69e8b3f6c1",
        content: "Prepared test cases for initial implementation.",
        createdAt: new Date("2023-11-04T14:00:00Z"),
        updatedAt: new Date("2023-11-04T14:00:00Z")
      }
    ]
  },
  {
    id: "29fa5e61-8354-43bd-b5fc-5e1c5f3a9d8a",
    projectId: "ed2a7b33-6d4b-4c92-810f-a1b37cd3ea3f",
    title: "Develop User Onboarding Guide",
    description: "Create comprehensive documentation for user onboarding.",
    pl: "Low",
    createdAt: new Date("2023-11-05T10:15:00Z"),
    updatedAt: new Date("2023-11-05T14:00:00Z"),
    status: "in-progress",
    jiraLink: "https://jira.example.com/DOCS-404",
    dueDate: new Date("2023-11-12T23:59:59Z"),
    notes: [
      {
        id: "e5a7f3c9-fc12-42c5-93f8-1d92b8e81235",
        taskId: "29fa5e61-8354-43bd-b5fc-5e1c5f3a9d8a",
        content: "Outlined key sections of the guide.",
        createdAt: new Date("2023-11-05T11:00:00Z"),
        updatedAt: new Date("2023-11-05T11:00:00Z")
      },
      {
        id: "a19c3f5b-634f-42d2-b48a-e91f3a8b6124",
        taskId: "29fa5e61-8354-43bd-b5fc-5e1c5f3a9d8a",
        content: "Gathered resources for user onboarding tips.",
        createdAt: new Date("2023-11-05T13:30:00Z"),
        updatedAt: new Date("2023-11-05T13:30:00Z")
      }
    ]
  }
];

export const days: Day[] = [
  {
    createdAt: new Date("2023-11-01T08:00:00Z"),
    updatedAt: new Date("2023-11-01T16:30:00Z"),
    startOfWork: 8,
    workedHours: 8,
    bookedHours: 6,
    externalBooking: 1,
    overtime: 1,
    workingDate: new Date("2023-11-01"),
    events: [
      {
        id: "event1",
        createdAt: new Date("2023-11-01T09:00:00Z"),
        updatedAt: new Date("2023-11-01T11:00:00Z"),
        title: "Design App UI",
        workedHours: 2,
        bookedHours: 1.5,
        externalBooking: 0,
        taskId: "b394f88e-e743-46ff-80ff-4995b45be7a7", // Reference to an existing task ID
        logs: [
          {
            createdAt: new Date("2023-11-01T09:15:00Z"),
            updatedAt: new Date("2023-11-01T09:45:00Z"),
            eventId: "event1",
            description: "Started initial design drafts.",
            duration: 0.5
          },
          {
            createdAt: new Date("2023-11-01T10:00:00Z"),
            updatedAt: new Date("2023-11-01T11:00:00Z"),
            eventId: "event1",
            description: "Completed revisions based on feedback.",
            duration: 1
          }
        ],
        bookings: [
          {
            createdAt: new Date("2023-11-01T10:30:00Z"),
            updatedAt: new Date("2023-11-01T10:30:00Z"),
            amount: 150,
            bookedDate: new Date("2023-11-01")
          }
        ]
      },
      {
        id: "event2",
        createdAt: new Date("2023-11-01T12:00:00Z"),
        updatedAt: new Date("2023-11-01T13:00:00Z"),
        title: "Implement App Backend",
        workedHours: 1,
        bookedHours: 1,
        externalBooking: 0,
        taskId: "6fd2f2ea-fbcb-49d8-ae83-d6cbf5b6e51e", // Reference to an existing task ID
        logs: [
          {
            createdAt: new Date("2023-11-01T12:15:00Z"),
            updatedAt: new Date("2023-11-01T12:45:00Z"),
            eventId: "event2",
            description: "Set up initial API routes.",
            duration: 0.5
          },
          {
            createdAt: new Date("2023-11-01T12:45:00Z"),
            updatedAt: new Date("2023-11-01T13:00:00Z"),
            eventId: "event2",
            description: "Tested API with mock data.",
            duration: 0.25
          }
        ],
        bookings: [
          {
            createdAt: new Date("2023-11-01T12:30:00Z"),
            updatedAt: new Date("2023-11-01T12:30:00Z"),
            amount: 120,
            bookedDate: new Date("2023-11-01")
          }
        ]
      }
    ]
  },
  {
    createdAt: new Date("2023-11-02T08:00:00Z"),
    updatedAt: new Date("2023-11-02T16:30:00Z"),
    startOfWork: 8,
    workedHours: 7,
    bookedHours: 5.5,
    externalBooking: 1,
    overtime: 0,
    workingDate: new Date("2023-11-02"),
    events: [
      {
        id: "event3",
        createdAt: new Date("2023-11-02T09:00:00Z"),
        updatedAt: new Date("2023-11-02T10:30:00Z"),
        title: "Design Social Media Ads",
        workedHours: 1.5,
        bookedHours: 1,
        externalBooking: 0,
        taskId: "58fa984f-ecf8-4291-89ff-7f56c6c8f9cd", // Reference to an existing task ID
        logs: [
          {
            createdAt: new Date("2023-11-02T09:30:00Z"),
            updatedAt: new Date("2023-11-02T10:00:00Z"),
            eventId: "event3",
            description: "Brainstormed design concepts.",
            duration: 0.5
          }
        ],
        bookings: [
          {
            createdAt: new Date("2023-11-02T10:15:00Z"),
            updatedAt: new Date("2023-11-02T10:15:00Z"),
            amount: 90,
            bookedDate: new Date("2023-11-02")
          }
        ]
      }
    ]
  }
];
