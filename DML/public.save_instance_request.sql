-- FUNCTION: public.save_instance_request(integer, integer, integer, integer, integer, integer, text, text, integer, integer, integer, text, integer, integer, text, text, text, boolean, text, timestamp without time zone, timestamp without time zone, text, text, date)

-- DROP FUNCTION IF EXISTS public.save_instance_request(integer, integer, integer, integer, integer, integer, text, text, integer, integer, integer, text, integer, integer, text, text, text, boolean, text, timestamp without time zone, timestamp without time zone, text, text, date);

CREATE OR REPLACE FUNCTION public.save_instance_request(
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
	p_created_timestamp timestamp without time zone,
	p_updated_timestamp timestamp without time zone,
	p_created_by text,
	p_updated_by text,
	p_selected_date date)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    new_instance_id INT;
BEGIN
    INSERT INTO instance_request (
        user_id, cpu_id, gpu_id, ram_id, gpu_vendor_id, time_slot_id, additional_requirements,
        remarks, image_id, gpu_partition_id, status_id, work_description, storage_volume,
        user_type_id, login_id, password, access_link, is_access_granted, additional_information,
        created_timestamp, updated_timestamp, created_by, updated_by, selected_date
    )
    VALUES (
        p_user_id, p_cpu_id, p_gpu_id, p_ram_id, p_gpu_vendor_id, p_time_slot_id, p_additional_requirements,
        p_remarks, p_image_id, p_gpu_partition_id, p_status_id, p_work_description, p_storage_volume,
        p_user_type_id, p_login_id, p_password, p_access_link, p_is_access_granted, p_additional_information,
        p_created_timestamp, p_updated_timestamp, p_created_by, p_updated_by, p_selected_date
    )
    RETURNING instance_id INTO new_instance_id;
    
    RETURN new_instance_id;
END;
$BODY$;

ALTER FUNCTION public.save_instance_request(integer, integer, integer, integer, integer, integer, text, text, integer, integer, integer, text, integer, integer, text, text, text, boolean, text, timestamp without time zone, timestamp without time zone, text, text, date)
    OWNER TO postgres;
