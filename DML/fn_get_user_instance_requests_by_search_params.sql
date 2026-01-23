-- FUNCTION: public.fn_get_user_instance_requests_by_search_params(integer, date, date, integer)

-- DROP FUNCTION IF EXISTS public.fn_get_user_instance_requests_by_search_params(integer, date, date, integer);

CREATE OR REPLACE FUNCTION public.fn_get_user_instance_requests_by_search_params(
	p_user_id integer,
	p_from_date date DEFAULT NULL::date,
	p_to_date date DEFAULT NULL::date,
	p_status_id integer DEFAULT NULL::integer)
    RETURNS TABLE(instance_request_id integer, user_id integer, remarks character varying, image_id integer, cpu_id integer, gpu_id integer, gpu_partition_id integer, ram_id integer, work_description character varying, status_id integer, storage_volume integer, user_type_id integer, login_id character varying, password character varying, access_link character varying, is_access_granted boolean, additional_information character varying, selected_date timestamp with time zone, created_timestamp timestamp with time zone, updated_timestamp timestamp with time zone, created_by integer, updated_by integer, time_slots jsonb) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
  RETURN QUERY
  SELECT 
    ir.instance_request_id,
    ir.user_id,
    ir.remarks,
    ir.image_id,
    ir.cpu_id,
    ir.gpu_id,
    ir.gpu_partition_id,
    ir.ram_id,
    ir.work_description,
    ir.status_id,
    ir.storage_volume,
    ir.user_type_id,
    ir.login_id,
    ir.password,
    ir.access_link,
    ir.is_access_granted,
    ir.additional_information,
    ir.selected_date,
    ir.created_timestamp,
    ir.updated_timestamp,
    ir.created_by,
    ir.updated_by,
    -- Aggregate time slots as JSON array
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'user_time_slot_id', uts.user_time_slot_id,
            'time_slot_id', uts.time_slot_id,
            'selected_date', uts.selected_date,
            'time_slot', ts.time_slot
          ) ORDER BY uts.selected_date, uts.time_slot_id
        )
        FROM user_time_slot uts
        LEFT JOIN time_slot ts ON ts.time_slot_id = uts.time_slot_id
        WHERE uts.instance_request_id = ir.instance_request_id
      ),
      '[]'::jsonb
    ) AS time_slots
  FROM instance_request ir
  WHERE ir.user_id = p_user_id
    -- Status filter
    AND (p_status_id IS NULL OR ir.status_id = p_status_id)
  -- Date range filter
AND (
  p_from_date IS NULL 
  OR (
      (
        -- Check instance_request.selected_date ALWAYS
        ir.selected_date::date >= p_from_date
        AND (p_to_date IS NULL OR ir.selected_date::date <= p_to_date)
      )
      OR
      (
        -- Check user_time_slot dates ALSO
        EXISTS (
          SELECT 1
          FROM user_time_slot uts_check
          WHERE uts_check.instance_request_id = ir.instance_request_id
            AND uts_check.selected_date::date >= p_from_date
            AND (p_to_date IS NULL OR uts_check.selected_date::date <= p_to_date)
        )
      )
  )
)

  ORDER BY ir.created_timestamp DESC;
END;
$BODY$;

ALTER FUNCTION public.fn_get_user_instance_requests_by_search_params(integer, date, date, integer)
    OWNER TO postgres;
