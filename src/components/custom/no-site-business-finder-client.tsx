"use client"

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  IconBuildingStore,
  IconHelpCircle,
  IconMapPin,
  IconSparkles,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type DecisionStatus = "NO_WEBSITE" | "HAS_WEBSITE"

type BusinessDecision = {
  placeId: string
  name: string
  mapsUrl: string
  reason?: string
  status: DecisionStatus
}

type ApiResponse = {
  success: boolean
  totalAnalyzed: number
  noWebsiteCount: number
  hasWebsiteCount: number
  noWebsiteBusinesses: BusinessDecision[]
  decisions: BusinessDecision[]
  txtReport: string
  csvReport: string
}

type LocationSuggestionsResponse = {
  suggestions: string[]
}

type AnalysisProgressPayload = {
  stage: "searching" | "details" | "classifying" | "done"
  searchedCount?: number
  detailsCompleted?: number
  detailsTotal?: number
  batchesCompleted?: number
  batchesTotal?: number
  noWebsiteCount?: number
  message?: string
}

type AnalysisEvent =
  | { type: "progress"; payload: AnalysisProgressPayload }
  | { type: "complete"; payload: ApiResponse }
  | { type: "error"; error: string }

const MAX_RESULTS_LIMIT = { min: 1, max: 100 }
const BATCH_SIZE_LIMIT = { min: 1, max: 50 }

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function parseBoundedNumber(
  input: string,
  min: number,
  max: number,
  fallback: number
): number {
  const parsed = Number.parseInt(input, 10)

  if (Number.isNaN(parsed)) {
    return fallback
  }

  return clampNumber(parsed, min, max)
}

function downloadFile(fileName: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function progressPercent(progress: AnalysisProgressPayload | null): number {
  if (!progress) {
    return 0
  }

  if (progress.stage === "searching") {
    return 15
  }

  if (progress.stage === "details") {
    const total = progress.detailsTotal ?? 0
    const done = progress.detailsCompleted ?? 0

    if (total <= 0) {
      return 25
    }

    return 15 + Math.round((done / total) * 45)
  }

  if (progress.stage === "classifying") {
    const total = progress.batchesTotal ?? 0
    const done = progress.batchesCompleted ?? 0

    if (total <= 0) {
      return 70
    }

    return 60 + Math.round((done / total) * 35)
  }

  return 100
}

function HelpLabel({
  htmlFor,
  label,
  help,
}: {
  htmlFor?: string
  label: string
  help: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={`${label} details`}
            className="text-muted-foreground hover:text-foreground"
            type="button"
          >
            <IconHelpCircle className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">{help}</TooltipContent>
      </Tooltip>
    </div>
  )
}

export default function NoSiteBusinessFinderClient() {
  const [location, setLocation] = useState("Toronto, Ontario")
  const [locationQuery, setLocationQuery] = useState("Toronto, Ontario")
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [isLoadingLocationSuggestions, setIsLoadingLocationSuggestions] =
    useState(false)
  const [businessType, setBusinessType] = useState("")
  const [smallBusinessFocus, setSmallBusinessFocus] = useState(true)
  const [maxResults, setMaxResults] = useState(50)
  const [batchSize, setBatchSize] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [progress, setProgress] = useState<AnalysisProgressPayload | null>(null)
  const [recentActivity, setRecentActivity] = useState<string[]>([])
  const requestAbortRef = useRef<AbortController | null>(null)
  const locationSuggestionsAbortRef = useRef<AbortController | null>(null)
  const hasLocationSuggestionQuery = locationQuery.trim().length >= 2

  const canSubmit = useMemo(() => {
    return !isLoading && location.trim().length > 0
  }, [isLoading, location])

  const noWebsiteDecisions = result?.decisions.filter(
    (decision) => decision.status === "NO_WEBSITE"
  )
  const hasWebsiteDecisions = result?.decisions.filter(
    (decision) => decision.status === "HAS_WEBSITE"
  )

  useEffect(() => {
    return () => {
      requestAbortRef.current?.abort()
      locationSuggestionsAbortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (!isLocationPickerOpen) {
      return
    }

    const trimmedQuery = locationQuery.trim()

    if (!hasLocationSuggestionQuery) {
      locationSuggestionsAbortRef.current?.abort()
      return
    }

    const timeoutId = setTimeout(async () => {
      locationSuggestionsAbortRef.current?.abort()
      const controller = new AbortController()
      locationSuggestionsAbortRef.current = controller
      setIsLoadingLocationSuggestions(true)

      try {
        const response = await fetch(
          `/api/misc/no-site-business-finder/location-suggestions?query=${encodeURIComponent(trimmedQuery)}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          setLocationSuggestions([])
          return
        }

        const data = (await response.json()) as LocationSuggestionsResponse
        setLocationSuggestions(data.suggestions)
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return
        }

        setLocationSuggestions([])
      } finally {
        if (locationSuggestionsAbortRef.current === controller) {
          locationSuggestionsAbortRef.current = null
          setIsLoadingLocationSuggestions(false)
        }
      }
    }, 250)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [hasLocationSuggestionQuery, isLocationPickerOpen, locationQuery])

  function handleMaxResultsChange(event: ChangeEvent<HTMLInputElement>) {
    setMaxResults(
      parseBoundedNumber(
        event.target.value,
        MAX_RESULTS_LIMIT.min,
        MAX_RESULTS_LIMIT.max,
        50
      )
    )
  }

  function handleBatchSizeChange(event: ChangeEvent<HTMLInputElement>) {
    setBatchSize(
      parseBoundedNumber(
        event.target.value,
        BATCH_SIZE_LIMIT.min,
        BATCH_SIZE_LIMIT.max,
        10
      )
    )
  }

  function selectLocation(nextLocation: string) {
    const trimmedLocation = nextLocation.trim()

    if (!trimmedLocation) {
      return
    }

    setLocation(trimmedLocation)
    setLocationQuery(trimmedLocation)
    setIsLocationPickerOpen(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setResult(null)
    setProgress({ stage: "searching", message: "Initializing search" })
    setRecentActivity(["Initializing search"])
    setIsLoading(true)

    requestAbortRef.current?.abort()
    const requestAbortController = new AbortController()
    requestAbortRef.current = requestAbortController

    try {
      const response = await fetch("/api/misc/no-site-business-finder", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        signal: requestAbortController.signal,
        body: JSON.stringify({
          location,
          businessType,
          maxResults,
          batchSize,
          smallBusinessFocus,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error("Unable to start analysis stream.")
      }

      const reader = response.body.getReader()
      const textDecoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { value, done } = await reader.read()

        if (done) {
          break
        }

        buffer += textDecoder.decode(value, { stream: true })
        const eventLines = buffer.split("\n")
        buffer = eventLines.pop() ?? ""

        for (const eventLine of eventLines) {
          if (!eventLine.trim()) {
            continue
          }

          const eventData = JSON.parse(eventLine) as AnalysisEvent

          if (eventData.type === "progress") {
            setProgress(eventData.payload)
            if (eventData.payload.message) {
              setRecentActivity((current) =>
                [...current, eventData.payload.message as string].slice(-8)
              )
            }
            continue
          }

          if (eventData.type === "complete") {
            setResult(eventData.payload)
            setProgress({ stage: "done", message: "Analysis complete" })
            continue
          }

          if (eventData.type === "error") {
            throw new Error(eventData.error)
          }
        }
      }
    } catch (requestError) {
      if (
        requestError instanceof DOMException &&
        requestError.name === "AbortError"
      ) {
        return
      }

      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unknown error while running analysis."
      setError(message)
      setRecentActivity((current) =>
        [...current, `Error: ${message}`].slice(-8)
      )
    } finally {
      if (requestAbortRef.current === requestAbortController) {
        requestAbortRef.current = null
      }

      setIsLoading(false)
    }
  }

  const currentProgress = progressPercent(progress)

  return (
    <TooltipProvider>
      <main className="container py-8 md:py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <IconSparkles className="size-5 text-primary" />
                  <CardTitle className="font-cal text-3xl md:text-4xl">
                    No Site Business Finder
                  </CardTitle>
                </div>
                <Badge variant="outline">AI-Assisted Lead Discovery</Badge>
              </div>
              <CardDescription className="max-w-3xl text-sm md:text-base">
                Discover local businesses that may need a website, review
                AI-assisted decisions, and export qualified opportunities in one
                flow.
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <IconMapPin className="mr-1 size-3" />
                  {location}
                </Badge>
                <Badge variant="secondary">
                  Niche: {businessType.trim() || "All business types"}
                </Badge>
                <Badge variant="secondary">Max results: {maxResults}</Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Target Configuration</CardTitle>
                <CardDescription>
                  Define location, niche focus, and processing volume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-2">
                    <HelpLabel
                      label="Location"
                      help="Choose the region to analyze. Suggestions are cached to reduce repeated requests."
                    />
                    <Popover
                      open={isLocationPickerOpen}
                      onOpenChange={(isOpen) => {
                        setIsLocationPickerOpen(isOpen)
                        if (isOpen) {
                          setLocationQuery(location)
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          className="w-full justify-start font-normal"
                          type="button"
                          variant="outline"
                        >
                          <IconMapPin className="mr-2 size-4" />
                          <span className="truncate">{location}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-[420px] p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search city, region, or country..."
                            value={locationQuery}
                            onValueChange={(value) => setLocationQuery(value)}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {!hasLocationSuggestionQuery
                                ? "Enter at least two characters."
                                : isLoadingLocationSuggestions
                                  ? "Loading suggestions..."
                                  : "No locations found."}
                            </CommandEmpty>
                            {locationQuery.trim().length > 0 ? (
                              <CommandItem
                                value={locationQuery}
                                onSelect={() => selectLocation(locationQuery)}
                              >
                                Use “{locationQuery}”
                              </CommandItem>
                            ) : null}
                            {hasLocationSuggestionQuery
                              ? locationSuggestions.map((suggestion) => (
                                  <CommandItem
                                    key={suggestion}
                                    value={suggestion}
                                    onSelect={() => selectLocation(suggestion)}
                                  >
                                    {suggestion}
                                  </CommandItem>
                                ))
                              : null}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <HelpLabel
                        htmlFor="businessType"
                        label="Business Type"
                        help="Optional niche filter. Example: dentist, bakery, salon, florist, auto repair."
                      />
                      <Input
                        id="businessType"
                        placeholder="bakery, salon, florist, auto repair..."
                        value={businessType}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setBusinessType(event.target.value)
                        }
                      />
                    </div>

                    <div className="grid gap-2 rounded-lg border p-3">
                      <HelpLabel
                        label="Small Business Focus"
                        help="When enabled, common chain brands are filtered and local candidates are prioritized."
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Prioritize local and independent listings.
                        </p>
                        <Switch
                          checked={smallBusinessFocus}
                          onCheckedChange={setSmallBusinessFocus}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <HelpLabel
                        htmlFor="maxResults"
                        label="Max Businesses"
                        help="How many listings to process. Larger values increase API usage and runtime."
                      />
                      <Input
                        id="maxResults"
                        min={MAX_RESULTS_LIMIT.min}
                        max={MAX_RESULTS_LIMIT.max}
                        type="number"
                        value={maxResults}
                        onChange={handleMaxResultsChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <HelpLabel
                        htmlFor="batchSize"
                        label="AI Batch Size"
                        help="How many businesses are sent to Gemini per request. Bigger batches are faster but may reduce stability on noisy inputs."
                      />
                      <Input
                        id="batchSize"
                        min={BATCH_SIZE_LIMIT.min}
                        max={BATCH_SIZE_LIMIT.max}
                        type="number"
                        value={batchSize}
                        onChange={handleBatchSizeChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Run analysis to generate categorized website
                      opportunities.
                    </p>
                    <Button
                      disabled={!canSubmit}
                      type="submit"
                      className="sm:min-w-52"
                    >
                      {isLoading ? "Analyzing..." : "Run Analysis"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Live Run Monitor</CardTitle>
                <CardDescription>
                  Track pipeline health, throughput, and recent activity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Pipeline Progress
                    </span>
                    <span className="font-medium">{currentProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Stage</p>
                    <p className="text-sm font-semibold capitalize">
                      {progress?.stage ?? "idle"}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Candidates</p>
                    <p className="text-sm font-semibold">
                      {progress?.searchedCount ?? result?.totalAnalyzed ?? 0}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Details</p>
                    <p className="text-sm font-semibold">
                      {progress?.detailsCompleted ?? 0}/
                      {progress?.detailsTotal ?? 0}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">No Website</p>
                    <p className="text-sm font-semibold">
                      {progress?.noWebsiteCount ?? result?.noWebsiteCount ?? 0}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Recent Activity
                  </p>
                  <div className="space-y-2">
                    {recentActivity.length === 0 ? (
                      <Badge variant="outline">Waiting to start analysis</Badge>
                    ) : (
                      recentActivity
                        .slice()
                        .reverse()
                        .map((activity, index) => (
                          <div
                            key={`${activity}-${index}`}
                            className="rounded-md border px-3 py-2 text-xs text-muted-foreground"
                          >
                            {activity}
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {error ? (
                  <div className="rounded-md border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-500">
                    {error}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          {result ? (
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Workspace</CardTitle>
                <CardDescription>
                  Review qualified leads, audit website-positive businesses, and
                  export deliverables.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-lg border bg-primary/5 p-4">
                    <p className="text-xs text-muted-foreground">
                      Opportunities
                    </p>
                    <p className="text-2xl font-semibold text-primary">
                      {result.noWebsiteCount}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      No website found
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">
                      Reviewed Positive
                    </p>
                    <p className="text-2xl font-semibold">
                      {result.hasWebsiteCount}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Official website present
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">
                      Total Analyzed
                    </p>
                    <p className="text-2xl font-semibold">
                      {result.totalAnalyzed}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Listings processed
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="opportunities">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="opportunities">
                      Opportunities ({noWebsiteDecisions?.length ?? 0})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Has Website ({hasWebsiteDecisions?.length ?? 0})
                    </TabsTrigger>
                    <TabsTrigger value="export">Export Files</TabsTrigger>
                  </TabsList>

                  <TabsContent value="opportunities" className="space-y-3">
                    {noWebsiteDecisions?.length ? (
                      noWebsiteDecisions.map((business) => (
                        <div
                          key={business.placeId}
                          className="rounded-lg border p-4 text-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Badge className="mb-2" variant="secondary">
                                No Website
                              </Badge>
                              <p className="font-semibold">{business.name}</p>
                              <a
                                className="text-primary underline"
                                href={business.mapsUrl}
                                rel="noreferrer"
                                target="_blank"
                              >
                                Open Google Maps Listing
                              </a>
                            </div>
                            <IconBuildingStore className="size-4 text-muted-foreground" />
                          </div>
                          <p className="mt-3 rounded-md bg-muted/60 p-3 text-muted-foreground">
                            {business.reason || "AI marked as no-website."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No businesses were classified as NO_WEBSITE in this run.
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="rejected" className="space-y-3">
                    {hasWebsiteDecisions?.length ? (
                      hasWebsiteDecisions.map((business) => (
                        <div
                          key={business.placeId}
                          className="rounded-lg border p-4 text-sm"
                        >
                          <Badge className="mb-2" variant="outline">
                            Has Website
                          </Badge>
                          <p className="font-semibold">{business.name}</p>
                          <a
                            className="text-primary underline"
                            href={business.mapsUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Open Google Maps Listing
                          </a>
                          <p className="mt-3 rounded-md bg-muted/60 p-3 text-muted-foreground">
                            {business.reason ||
                              "AI found enough signal that an official website exists."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No businesses were classified as HAS_WEBSITE.
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="export">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Download no-website opportunities in your preferred
                        format.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            downloadFile(
                              "places_businesses_without_websites.txt",
                              result.txtReport,
                              "text/plain;charset=utf-8"
                            )
                          }
                        >
                          Download TXT
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            downloadFile(
                              "places_businesses_without_websites.csv",
                              result.csvReport,
                              "text/csv;charset=utf-8"
                            )
                          }
                        >
                          Download CSV
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : null}

          <Separator />
        </div>
      </main>
    </TooltipProvider>
  )
}
