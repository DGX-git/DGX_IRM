-- FUNCTION: public.fn_get_fad_tad_instance_requests_by_search_params(integer, date, date, integer, integer)

-- DROP FUNCTION IF EXISTS public.fn_get_fad_tad_instance_requests_by_search_params(integer, date, date, integer, integer);

CREATE OR REPLACE FUNCTION public.fn_get_fad_tad_instance_requests_by_search_params(
	logged_in_user_id integer,
	from_date_param date DEFAULT NULL::date,
	to_date_param date DEFAULT NULL::date,
	status_id_param integer DEFAULT NULL::integer,
	institute_id_param integer DEFAULT NULL::integer)
    RETURNS TABLE(instance_request_id integer, user_id integer, remarks character varying, image_id integer, cpu_id integer, gpu_id integer, gpu_partition_id integer, ram_id integer, work_description character varying, status_id integer, storage_volume integer, user_type_id integer, login_id character varying, password character varying, access_link character varying, is_access_granted boolean, additional_information character varying, selected_date timestamp with time zone, created_timestamp timestamp with time zone, updated_timestamp timestamp with time zone, created_by integer, updated_by integer, time_slots jsonb) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
  user_institute_ids INT[];
  target_institute_ids INT[];
BEGIN
  -- Get all institute IDs associated with the logged-in user
  SELECT ARRAY_AGG(DISTINCT uia.institute_id)
  INTO user_institute_ids
  FROM user_institute_association uia
  WHERE uia.user_id = logged_in_user_id;

  -- If no institutes found, return empty
  IF user_institute_ids IS NULL OR array_length(user_institute_ids, 1) IS NULL THEN
    RETURN;
  END IF;

  -- Determine which institutes to filter by
  IF institute_id_param IS NULL OR institute_id_param = 0 THEN
    -- "All" selected - use all user's institutes
    target_institute_ids := user_institute_ids;
  ELSE
    -- Specific institute selected
    target_institute_ids := ARRAY[institute_id_param];
  END IF;

  -- Return filtered instance requests with time_slots
  RETURN QUERY
  SELECT DISTINCT ON (ir.instance_request_id)
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
    -- ⭐ NEW: Aggregate time slots as JSONB array
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'user_time_slot_id', uts2.user_time_slot_id,
            'time_slot_id', uts2.time_slot_id,
            'selected_date', uts2.selected_date,
            'time_slot', ts.time_slot
          ) ORDER BY uts2.selected_date, uts2.time_slot_id
        )
        FROM user_time_slot uts2
        LEFT JOIN time_slot ts ON ts.time_slot_id = uts2.time_slot_id
        WHERE uts2.instance_request_id = ir.instance_request_id
      ),
      '[]'::jsonb
    ) AS time_slots
  FROM instance_request ir
  INNER JOIN user_institute_association uia ON ir.user_id = uia.user_id
  LEFT JOIN user_time_slot uts ON ir.instance_request_id = uts.instance_request_id
  WHERE 
    -- Institute filter
    uia.institute_id = ANY(target_institute_ids)
    
    -- Status filter
    AND (
      status_id_param IS NULL 
      OR status_id_param = 0 
      OR ir.status_id = status_id_param
    )
    
    -- Date range filter
AND (
  from_date_param IS NULL 
  OR (
      (
        -- Check instance_request.selected_date ALWAYS
        ir.selected_date::date >= from_date_param
        AND (to_date_param IS NULL OR ir.selected_date::date <= to_date_param)
      )
      OR
      (
        -- Check user_time_slot dates ALSO
        EXISTS (
          SELECT 1
          FROM user_time_slot uts_check
          WHERE uts_check.instance_request_id = ir.instance_request_id
            AND uts_check.selected_date::date >= from_date_param
            AND (to_date_param IS NULL OR uts_check.selected_date::date <= to_date_param)
        )
      )
  )
)

  ORDER BY ir.instance_request_id, ir.created_timestamp DESC;
END;
$BODY$;

ALTER FUNCTION public.fn_get_fad_tad_instance_requests_by_search_params(integer, date, date, integer, integer)
    OWNER TO postgres;
