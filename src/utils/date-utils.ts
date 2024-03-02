import {DateTime} from "luxon";

export function humanReadableInterval(date: number): string {
  const now = DateTime.utc()
  const parsedDate = DateTime.fromSeconds(date)
  const diff = now.diff(parsedDate, ['years', 'months', 'days', 'hours', 'minutes', 'seconds'])

  if (diff.years > 0) {
    return `${diff.years} ${_pluralize('ano', 'anos', diff.years)} atrás`
  }

  if (diff.months > 0) {
    return `${diff.months} ${_pluralize('mês', 'meses', diff.months)} atrás`
  }

  if (diff.days > 0) {
    return `${diff.days} ${_pluralize('dia', 'dias', diff.days)} atrás`
  }

  if (diff.hours > 0) {
    return `${diff.hours} ${_pluralize('hora', 'horas', diff.hours)} atrás`
  }

  if (diff.minutes > 0) {
    return `${diff.minutes} ${_pluralize('minuto', 'minutos', diff.minutes)} atrás`
  }

  if (diff.seconds > 0) {
    return `${diff.seconds} ${_pluralize('segundo', 'segundos', diff.seconds)} atrás`
  }


  return `${parsedDate.toFormat('dd/MM/yyyy HH:mm:ss')}`
}

function _pluralize(singular: string, plural: string, count: number): string {
  return count === 1 ? singular : plural
}
