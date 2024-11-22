"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, X, Play, MessageSquare, Check, XIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const invoices = [
  {
    name: "John Doe",
    date: "2023-05-15",
    interviewer: "Alice Smith",
    duration: "45 min",
    details: [
      { label: "Position", value: "Web Developer" },
      { label: "Department", value: "IT" },
      { label: "Location", value: "Remote" },
      { label: "Status", value: "First Interview" },
    ],
    interviewVideo: "/placeholder.svg?height=400&width=600",
  },
  {
    name: "Jane Smith",
    date: "2023-05-20",
    interviewer: "Bob Johnson",
    duration: "60 min",
    details: [
      { label: "Position", value: "UX Designer" },
      { label: "Department", value: "Design" },
      { label: "Location", value: "New York" },
      { label: "Status", value: "Second Interview" },
    ],
    interviewVideo: "/placeholder.svg?height=400&width=600",
  },
  {
    name: "Mike Brown",
    date: "2023-05-25",
    interviewer: "Carol Williams",
    duration: "30 min",
    details: [
      { label: "Position", value: "Project Manager" },
      { label: "Department", value: "Operations" },
      { label: "Location", value: "Chicago" },
      { label: "Status", value: "Final Interview" },
    ],
    interviewVideo: "/placeholder.svg?height=400&width=600",
  },
  {
    name: "Sarah Lee",
    date: "2023-06-01",
    interviewer: "David Miller",
    duration: "45 min",
    details: [
      { label: "Position", value: "Data Analyst" },
      { label: "Department", value: "Analytics" },
      { label: "Location", value: "San Francisco" },
      { label: "Status", value: "Technical Interview" },
    ],
    interviewVideo: "/placeholder.svg?height=400&width=600",
  },
]

export default function EnhancedTableDemo() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [candidateStatus, setCandidateStatus] = useState<Record<string, 'pending' | 'accepted' | 'rejected'>>({})

  const toggleRow = (name: string) => {
    setExpandedRow(expandedRow === name ? null : name)
  }

  const handleCandidateAction = (name: string, action: 'accepted' | 'rejected') => {
    setCandidateStatus(prev => ({ ...prev, [name]: action }))
  }

  const getAIResponse = (name: string) => {
    // This is a placeholder function. In a real application, this would call an API to get the AI response.
    console.log(`Getting AI response for candidate ${name}`)
    alert(`AI response generated for candidate ${name}`)
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableCaption>A list of recent candidate interviews.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Interviewer</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <>
              <TableRow key={invoice.name}>
                <TableCell className="font-medium">{invoice.name}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.interviewer}</TableCell>
                <TableCell className="text-right">{invoice.duration}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleRow(invoice.name)}
                    aria-expanded={expandedRow === invoice.name}
                    aria-controls={`details-${invoice.name}`}
                  >
                    {expandedRow === invoice.name ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Close
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow
                id={`details-${invoice.name}`}
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  expandedRow === invoice.name ? "table-row" : "hidden"
                )}
              >
                <TableCell colSpan={5} className="p-0">
                  <div className="p-4 bg-muted rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead className="w-[300px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoice.details.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{detail.label}</TableCell>
                            <TableCell>{detail.value}</TableCell>
                            {index === 0 && (
                              <TableCell rowSpan={invoice.details.length} className="align-middle">
                                <div className="flex flex-col space-y-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-full">
                                        <Play className="mr-2 h-4 w-4" />
                                        View Interview
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[625px]">
                                      <DialogHeader>
                                        <DialogTitle>Interview Video</DialogTitle>
                                        <DialogDescription>
                                          Interview video for candidate {invoice.name}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="mt-4">
                                        <img
                                          src={invoice.interviewVideo}
                                          alt={`Interview video for candidate ${invoice.name}`}
                                          className="w-full h-auto"
                                        />
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => getAIResponse(invoice.name)}
                                  >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    AI Generated Response
                                  </Button>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant={candidateStatus[invoice.name] === 'accepted' ? 'default' : 'outline'} 
                                      size="sm"
                                      onClick={() => handleCandidateAction(invoice.name, 'accepted')}
                                      className="flex-1"
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      Accept
                                    </Button>
                                    <Button 
                                      variant={candidateStatus[invoice.name] === 'rejected' ? 'destructive' : 'outline'} 
                                      size="sm"
                                      onClick={() => handleCandidateAction(invoice.name, 'rejected')}
                                      className="flex-1"
                                    >
                                      <XIcon className="mr-2 h-4 w-4" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Interviews</TableCell>
            <TableCell className="text-right">{invoices.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}