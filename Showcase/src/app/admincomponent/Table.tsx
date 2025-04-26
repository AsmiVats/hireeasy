"use client"
import React from "react";
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
import { Eye, X, Play, MessageSquare, Check, XIcon } from "lucide-react"
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
    id: "1", // Add unique IDs for each invoice
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
  // Other candidates here...
]

export default function EnhancedTableDemo() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [candidateStatus, setCandidateStatus] = useState<
    Record<string, "pending" | "accepted" | "rejected">
  >({})

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  const handleCandidateAction = (id: string, action: "accepted" | "rejected") => {
    setCandidateStatus((prev) => ({ ...prev, [id]: action }))
  }

  const getAIResponse = (name: string) => {
    // Simulate an API call or action
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
            <React.Fragment key={invoice.id}>
              {/* Main Row */}
              <TableRow>
                <TableCell className="font-medium">{invoice.name}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.interviewer}</TableCell>
                <TableCell className="text-right">{invoice.duration}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRow(invoice.id)}
                    aria-expanded={expandedRow === invoice.id}
                    aria-controls={`details-${invoice.id}`}
                  >
                    {expandedRow === invoice.id ? (
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

              {/* Expanded Details Row */}
              {expandedRow === invoice.id && (
                <TableRow id={`details-${invoice.id}`}>
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
                          {invoice.details.map((detail) => (
                            <TableRow key={`${invoice.id}-${detail.label}`}>
                              <TableCell className="font-medium">
                                {detail.label}
                              </TableCell>
                              <TableCell>{detail.value}</TableCell>
                              {detail.label === "Position" && (
                                <TableCell
                                  rowSpan={invoice.details.length}
                                  className="align-middle"
                                >
                                  <div className="flex flex-col space-y-2">
                                    {/* View Interview Dialog */}
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full"
                                        >
                                          <Play className="mr-2 h-4 w-4" />
                                          View Interview
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[625px]">
                                        <DialogHeader>
                                          <DialogTitle>Interview Video</DialogTitle>
                                          <DialogDescription>
                                            Interview video for candidate{" "}
                                            {invoice.name}
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

                                    {/* AI Response Button */}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => getAIResponse(invoice.name)}
                                    >
                                      <MessageSquare className="mr-2 h-4 w-4" />
                                      AI Generated Response
                                    </Button>

                                    {/* Accept/Reject Buttons */}
                                    <div className="flex space-x-2">
                                      <Button
                                        variant={
                                          candidateStatus[invoice.id] === "accepted"
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                          handleCandidateAction(invoice.id, "accepted")
                                        }
                                        className="flex-1"
                                      >
                                        <Check className="mr-2 h-4 w-4" />
                                        Accept
                                      </Button>
                                      <Button
                                        variant={
                                          candidateStatus[invoice.id] === "rejected"
                                            ? "destructive"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                          handleCandidateAction(invoice.id, "rejected")
                                        }
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
              )}
            </React.Fragment>
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
