-- FUNCTION: public.get_user_types()

-- DROP FUNCTION IF EXISTS public.get_user_types();

CREATE OR REPLACE FUNCTION public.get_user_types(
	)
    RETURNS TABLE(user_type_id integer, type_name text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY 
    SELECT user_type_id, type_name
    FROM user_type;
END;
$BODY$;

ALTER FUNCTION public.get_user_types()
    OWNER TO postgres;
