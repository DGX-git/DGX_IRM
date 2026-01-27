-- FUNCTION: public.delete_instance_request(integer) TESTT

-- DROP FUNCTION IF EXISTS public.delete_instance_request(integer);

CREATE OR REPLACE FUNCTION public.delete_instance_request(
	p_instance_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    DELETE FROM instance_request WHERE instance_id = p_instance_id;
END;
$BODY$;

ALTER FUNCTION public.delete_instance_request(integer)
    OWNER TO postgres;
