import type * as types from "@/types"

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Etc/GMT-0",
  }).format(new Date(date))
}

type TimeFrame = "daily" | "weekly" | "monthly"
type ArrayType = types.Sale | types.Run | types.Payment | types.Export | types.Income

export function getTimeFrame(timeframe: TimeFrame): string {
  const today = new Date()

  switch (timeframe) {
    case "daily":
      return "Aujourd'hui"
    case "weekly":
      return "Cette semaine"
    case "monthly": {
      const date = new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric",
      }).format(today)
      return date.charAt(0).toUpperCase() + date.slice(1)
    }

    default:
      return ""
  }
}

export function getTime(array: ArrayType[], timeframe: TimeFrame): ArrayType[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const offsetDays = timeframe === "daily" ? 1 : timeframe === "weekly" ? 7 : 30
  const startTime = today.getTime() - offsetDays * 24 * 60 * 60 * 1000
  const endTime = today.getTime()

  return array.filter((item) => {
    const itemDate = new Date(item.date)
    itemDate.setHours(0, 0, 0, 0)
    const time = itemDate.getTime()
    return time >= startTime && time <= endTime
  })
}

export function getTimeAmount(array: ArrayType[], timeframe: TimeFrame): string {
  const data = getTime(array, timeframe)
  const value = data.reduce((acc, item) => acc + (item.amount || 0), 0)
  return value.toLocaleString("fr-FR")
}

export function getTimePercentage(array: ArrayType[], timeframe: TimeFrame): number {
  const current = getTime(array, timeframe)
  const previous = getTime(array.slice(1), timeframe)

  const diff = current.length - previous.length
  const percent = (diff / (previous.length || 1)) * 100

  if (isNaN(percent) || percent === Number.POSITIVE_INFINITY) return 0
  return percent > 0 ? Number(percent.toFixed(0)) : 0
}

export function getEmployeeTime(employee: types.Employee): string {
  const time = employee.time_in_service
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = time % 60

  return `${hours.toLocaleString("fr-FR")}h ${minutes.toLocaleString("fr-FR")}m ${seconds.toLocaleString("fr-FR")}s`
}

// Nouvelles fonctions pour le graphique et l'analyse

export function getChartData(incomes: types.Income[]): { label: string; amount: number }[] {
  const daily = Number.parseFloat(getTimeAmount(incomes, "daily").replace(/\s/g, ""))
  const weekly = Number.parseFloat(getTimeAmount(incomes, "weekly").replace(/\s/g, ""))
  const monthly = Number.parseFloat(getTimeAmount(incomes, "monthly").replace(/\s/g, ""))

  return [
    { label: "Jour", amount: daily },
    { label: "Semaine", amount: weekly },
    { label: "Mois", amount: monthly },
  ]
}

export function getLast7DaysData(incomes: types.Income[]): { day: string; amount: number }[] {
  const today = new Date()
  const last7Days = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const dayIncomes = incomes.filter((income) => {
      const incomeDate = new Date(income.date)
      incomeDate.setHours(0, 0, 0, 0)
      return incomeDate.getTime() === date.getTime()
    })

    const totalAmount = dayIncomes.reduce((sum, income) => sum + (income.amount || 0), 0)

    const dayName = date.toLocaleDateString("fr-FR", { weekday: "short" })

    last7Days.push({
      day: dayName,
      amount: totalAmount,
    })
  }

  return last7Days
}

export function getIncomeInsights(incomes: types.Income[]): {
  trend: "up" | "down"
  trendMessage: string
  bestPeriod: string
  monthlyGoal: string
  dailyAverage: string
  recommendation: string
} {
  const weeklyPercentage = getTimePercentage(incomes, "weekly")

  const dailyAmount = Number.parseFloat(getTimeAmount(incomes, "daily").replace(/\s/g, ""))
  const weeklyAmount = Number.parseFloat(getTimeAmount(incomes, "weekly").replace(/\s/g, ""))
  const monthlyAmount = Number.parseFloat(getTimeAmount(incomes, "monthly").replace(/\s/g, ""))

  // Calcul de la moyenne quotidienne sur les 7 derniers jours
  const last7DaysData = getLast7DaysData(incomes)
  const weeklyTotal = last7DaysData.reduce((sum, day) => sum + day.amount, 0)
  const dailyAverageAmount = weeklyTotal / 7

  // Déterminer la tendance
  const trend = weeklyPercentage >= 0 ? "up" : "down"
  const trendMessage =
    trend === "up"
      ? `Vos revenus sont en hausse de ${Math.abs(weeklyPercentage)}% cette semaine`
      : `Vos revenus ont baissé de ${Math.abs(weeklyPercentage)}% cette semaine`

  // Meilleure période
  const amounts = [
    { period: "quotidienne", amount: dailyAmount },
    { period: "hebdomadaire", amount: weeklyAmount },
    { period: "mensuelle", amount: monthlyAmount },
  ]
  const bestPeriod = amounts.reduce((prev, current) => (current.amount > prev.amount ? current : prev))
  const bestPeriodMessage = `Votre meilleure performance ${bestPeriod.period} : ${bestPeriod.amount.toLocaleString("fr-FR")}$`

  // Objectif mensuel
  const projectedMonthly = dailyAverageAmount * 30
  const monthlyGoal =
    monthlyAmount > 0
      ? `${((monthlyAmount / projectedMonthly) * 100).toFixed(0)}% de l'objectif projeté atteint`
      : `Projection mensuelle : ${projectedMonthly.toLocaleString("fr-FR")}$`

  // Moyenne quotidienne
  const dailyAverage = `${dailyAverageAmount.toLocaleString("fr-FR")}$ par jour en moyenne`

  // Recommandation
  let recommendation = ""
  if (trend === "up" && dailyAverageAmount > dailyAmount) {
    recommendation = "Excellente progression ! Maintenez cette dynamique positive."
  } else if (trend === "down") {
    recommendation = "Analysez les facteurs de baisse et ajustez votre stratégie."
  } else if (dailyAverageAmount < 100) {
    recommendation = "Concentrez-vous sur l'augmentation des revenus quotidiens."
  } else {
    recommendation = "Stabilisez vos revenus et cherchez de nouvelles opportunités."
  }

  return {
    trend,
    trendMessage,
    bestPeriod: bestPeriodMessage,
    monthlyGoal,
    dailyAverage,
    recommendation,
  }
}
