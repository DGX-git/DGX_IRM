-- FUNCTION: public.update_instance_request(integer, integer, integer, integer, integer, integer, integer, text, text, integer, integer, integer, text, integer, integer, text, text, text, boolean, text, timestamp without time zone, text, date)

-- DROP FUNCTION IF EXISTS public.update_instance_request(integer, integer, integer, integer, integer, integer, integer, text, text, integer, integer, integer, text, integer, integer, text, text, text, boolean, text, timestamp without time zone, text, date);

CREATE OR REPLACE FUNCTION public.update_instance_request(
	p_instance_id integer,
	p_user_id integer,
	p_cpu_id integer,
	p_gpu_id integer,
	p_ram_id integer,
	p_gpu_vendor_id integer,
	p_time_slot_id integer,
	p_additional_requirements text,
	p_remarks text,
	p_image_id integer,
	p_gpu_partition_id integer,
	p_status_id integer,
	p_work_description text,
	p_storage_volume integer,
	p_user_type_id integer,
	p_login_id text,
	p_password text,
	p_access_link text,
	p_is_access_granted boolean,
	p_additional_information text,
	p_updated_timestamp timestamp without time zone,
	p_updated_by text,
	p_selected_date date)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    UPDATE instance_request
    SET 
        user_id = p_user_id,
        cpu_id = p_cpu_id,
        gpu_id = p_gpu_id,
        ram_id = p_ram_id,
        gpu_vendor_id = p_gpu_vendor_id,
        time_slot_id = p_time_slot_id,
        additional_requirements = p_additional_requirements,
        remarks = p_remarks,
        image_id = p_image_id,
        gpu_partition_id = p_gpu_partition_id,
        status_id = p_status_id,
        work_description = p_work_description,
        storage_volume = p_storage_volume,
        user_type_id = p_user_type_id,
        login_id = p_login_id,
        password = p_password,
        access_link = p_access_link,
        is_access_granted = p_is_access_granted,
        additional_information = p_additional_information,
        updated_timestamp = p_updated_timestamp,
        updated_by = p_updated_by,
        selected_date = p_selected_date
    WHERE instance_id = p_instance_id;
END;
$BODY$;

ALTER FUNCTION public.update_instance_request(integer, integer, integer, integer, integer, integer, integer, text, text, integer, integer, integer, text, integer, integer, text, text, text, boolean, text, timestamp without time zone, text, date)
    OWNER TO postgres;
