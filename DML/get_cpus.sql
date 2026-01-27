-- FUNCTION: public.get_cpus()

-- DROP FUNCTION IF EXISTS public.get_cpus();

CREATE OR REPLACE FUNCTION public.get_cpus(
	)
    RETURNS TABLE(cpu_id integer, cpu_name text, cores integer, frequency numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY 
    SELECT cpu_id, cpu_name, cores, frequency
    FROM cpu;
END;
$BODY$;

ALTER FUNCTION public.get_cpus()
    OWNER TO postgres;
