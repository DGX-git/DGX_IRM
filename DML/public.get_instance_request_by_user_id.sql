-- FUNCTION: public.get_instance_request_by_user_id(integer)

-- DROP FUNCTION IF EXISTS public.get_instance_request_by_user_id(integer);

CREATE OR REPLACE FUNCTION public.get_instance_request_by_user_id(
	p_user_id integer)
    RETURNS TABLE(instance_id integer, cpu_id integer, gpu_id integer, ram_id integer, gpu_vendor_id integer, time_slot_id integer, additional_requirements text, remarks text, image_id integer, gpu_partition_id integer, status_id integer, work_description text, storage_volume integer, user_type_id integer, login_id text, password text, access_link text, is_access_granted boolean, additional_information text, created_timestamp timestamp without time zone, updated_timestamp timestamp without time zone, created_by text, updated_by text, selected_date date) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY 
    SELECT * 
    FROM instance_request 
    WHERE user_id = p_user_id;
END;
$BODY$;

ALTER FUNCTION public.get_instance_request_by_user_id(integer)
    OWNER TO postgres;
