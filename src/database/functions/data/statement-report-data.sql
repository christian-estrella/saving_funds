--drop function process.statement_report_data;
create or replace function process.statement_report_data(
  in p_associate_id integer
)
returns table (
  current_year integer,
  associate_code text,
  associate_name text,
  is_fortnightly boolean,
  count_frequency integer,
  date_range text,
  frequent_contribution numeric(20,6),
  amount_to_withhold numeric(20,6),
  amount_available_to_withdrawal numeric(20,6),
  amount_available_to_withdrawal_rounded numeric(20,6),
  net_balance_for_current_year numeric(20,6),
  net_balance numeric(20,6)
) as $$
declare
  v_current_year integer;
begin
  -- Get the current year.
  v_current_year := (select extract(year from now())::integer);

  return query
  select
    report.current_year
    ,report.associate_code
    ,report.associate_name
    ,report.is_fortnightly
    ,report.count_frequency
    ,report.date_range
    ,report.frequent_contribution
    ,report.amount_to_withhold
    ,coalesce(report.amount_available_to_withdrawal, 0) as amount_available_to_withdrawal
    ,coalesce(report.amount_available_to_withdrawal_rounded, 0) as amount_available_to_withdrawal_rounded
    ,coalesce((report.net_balance - report.amount_available_to_withdrawal_rounded - report.amount_to_withhold), 0)
      as net_balance_for_current_year
    ,(report.net_balance - report.amount_available_to_withdrawal_rounded) as net_balance
  from (
    select
      v_current_year as current_year
      ,r.associate_code
      ,r.associate_name
      ,r.is_fortnightly
      ,r.count_frequency
      ,r.date_range
      ,r.frequent_contribution
      ,r.amount_to_withhold
      ,case when (r.amount_available_to_withdrawal - r.amount_to_withhold) < 0
        then 0
        else (r.amount_available_to_withdrawal - r.amount_to_withhold)
      end as amount_available_to_withdrawal
      ,case when (r.amount_available_to_withdrawal - r.amount_to_withhold) < 0
        then 0
        else (floor((r.amount_available_to_withdrawal - r.amount_to_withhold) / 100) * 100)
--         else case when (r.amount_available_to_withdrawal - r.amount_to_withhold) % 100 < 50
--           then (floor((r.amount_available_to_withdrawal - r.amount_to_withhold) / 100) * 100)
--           else (ceil(((r.amount_available_to_withdrawal - r.amount_to_withhold) / 100)) * 100)
--         end
      end as amount_available_to_withdrawal_rounded
      ,r.net_balance
    from (
      select
        (a.rfc || '-' || a.id) as associate_code
        ,a.name::text as associate_name
        ,case when ag.name = 'ISS' then false else true end as is_fortnightly
        ,case when ag.name = 'ISS' then 12 else 24 end as count_frequency
        ,to_char(current_date, 'DD-MM-YYYY') as date_range
        ,(a.detail->>'frequentContribution')::numeric(20,6) as frequent_contribution
        ,case when ag.name = 'ISS'
          then (a.detail->>'socialContribution')::numeric(20,6) * 3 -- ISS is pension
          else (a.detail->>'socialContribution')::numeric(20,6) * 6 -- Any other
        end as amount_to_withhold
        ,(
          select
            case when rs.net_total < 0 then 0 else rs.net_total end as net_total
          from process.statement_report_list(p_associate_id) as rs
          where rs."year" = (v_current_year - 1)
          limit 1
        ) as amount_available_to_withdrawal
        ,(
          select
            case when rs.net_total < 0 then 0 else rs.net_total end as net_total
          from process.statement_report_list(p_associate_id) as rs
          order by rs.year desc
          limit 1
        ) as net_balance
      from catalog.associate as a
      join "system".agreement as ag
        on (a.detail->>'agreementId')::integer = ag.id
      where a.id = p_associate_id
    ) as r
  ) as report;
end;
$$ language plpgsql;
