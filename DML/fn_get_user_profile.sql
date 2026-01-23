-- FUNCTION: public.fn_get_user_profile(text)

-- DROP FUNCTION IF EXISTS public.fn_get_user_profile(text);

CREATE OR REPLACE FUNCTION public.fn_get_user_profile(
	p_email text)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    user_data JSONB;
    role_data JSONB;
    associations JSONB;
    institutes_list JSONB;
    departments_list JSONB;
BEGIN
    ----------------------------------------------
    -- Get User
    ----------------------------------------------
    SELECT jsonb_build_object(
        'id', u.user_id,
        'firstname', u.first_name,
        'lastname', u.last_name,
        'role_id', u.role_id,
        'contact_no', u.contact_no,
        'email_id', u.email_id
    )
    INTO user_data
    FROM dgx_user u
    WHERE u.email_id = p_email;

    IF user_data IS NULL THEN
        RETURN jsonb_build_object('error', 'User not found');
    END IF;

    ----------------------------------------------
    -- Get Role
    ----------------------------------------------
    SELECT jsonb_build_object(
        'role_id', r.role_id,
        'role_name', r.role_name
    )
    INTO role_data
    FROM role r
    WHERE r.role_id = (user_data->>'role_id')::INT;

    ----------------------------------------------
    -- Get Associations WITH names
    ----------------------------------------------
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', a.user_institute_association_id,
            'institute_id', a.institute_id,
            'department_id', a.department_id,
            'is_reg_institute', a.is_reg_institute,
            'instituteName', i.institute_name,
            'departmentName', d.department_name 
        )
    )
    INTO associations
    FROM user_institute_association a
    LEFT JOIN institute i ON i.institute_id = a.institute_id
    LEFT JOIN department d ON d.department_id = a.department_id
    WHERE a.user_id = (user_data->>'id')::INT;

    ----------------------------------------------
    -- Get All Institutes (Master)
    ----------------------------------------------
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', institute_id,
            'name', institute_name
        )
    )
    INTO institutes_list
    FROM institute;

    ----------------------------------------------
    -- Get All Departments (Master)
    ----------------------------------------------
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', department_id,
            'name', department_name,
            'institute_id', institute_id
        )
    )
    INTO departments_list
    FROM department;

    ----------------------------------------------
    -- FINAL RESPONSE 
    ----------------------------------------------
    RETURN jsonb_build_object(
        'user', user_data,
        'role', role_data,
        'associations', COALESCE(associations, '[]'::jsonb),
        'masterData', jsonb_build_object(
            'institutes', COALESCE(institutes_list, '[]'::jsonb),
            'departments', COALESCE(departments_list, '[]'::jsonb)
        )
    );

END;
$BODY$;

ALTER FUNCTION public.fn_get_user_profile(text)
    OWNER TO postgres;
