import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
const chartData = [
  { month: "Januari", dukungan: 50000 },
  { month: "Februari", dukungan: 350000 },
  { month: "Maret", dukungan: 2000000 },
  { month: "April", dukungan: 1500000 },
  { month: "Mei", dukungan: 209000 },
  { month: "Juni", dukungan: 214000 },
  { month: "Juli", dukungan: 214000 },
  { month: "Agustus", dukungan: 214000 },
  { month: "September", dukungan: 214000 },
  { month: "Oktober", dukungan: 214000 },
  { month: "November", dukungan: 214000 },
  { month: "Desember", dukungan: 214000 },
];

const chartConfig = {
  dukungan: {
    label: "Dukungan",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ThisYearDonationsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jumlah Dukungan</CardTitle>
        <CardDescription>
          Menampilkan jumlah dukungan yang diterima selama tahun ini
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full h-52" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="dukungan"
              type="natural"
              fill="var(--color-dukungan)"
              fillOpacity={0.4}
              stroke="var(--color-dukungan)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Januari - Desember 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
