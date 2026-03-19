interface Props {
  month: string;
  year: string;
  monthTouched: boolean | undefined;
  yearTouched: boolean | undefined;
}

const Expiration = ({ month, year, monthTouched, yearTouched }: Props) => {
  // Форматируем год: берем последние 2 цифры, если это "2026" -> "26"
  // const shortYear = year.length > 2 ? year.slice(-2) : year;

  return (
    <div className="flex flex-col items-start gap-1 shrink-0">
      <div className="uppercase opacity-70 text-sm font-[Ubuntu] mb-1">
        valid thru
      </div>

      <div className="uppercase text-xl font-[Ubuntu]">
        {/* Месяц: если не выбран, показываем MM */}
        <span className={monthTouched ? "embossed-text-light" : "opacity-40"}>
          {monthTouched ? month : "MM"}
        </span>

        <span
          className={
            yearTouched ? "mx-1 embossed-text-light" : "mx-1 opacity-40"
          }
        >
          /
        </span>

        {/* Год: если не выбран, показываем YY */}
        <span className={yearTouched ? "embossed-text-light" : "opacity-40"}>
          {yearTouched ? year.slice(-2) : "YY"}
          {/* Форматируем год: берем последние 2 цифры, если это "2026" -> "26" */}
        </span>
      </div>
    </div>
  );
};

export default Expiration;
