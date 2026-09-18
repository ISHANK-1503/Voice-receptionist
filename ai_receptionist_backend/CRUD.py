from database import get_connection


def get_appointments_with_clients():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            a.appointment_id,
            a.appointment_date,
            a.service,
            a.status,
            c.name AS client_name,
            c.phone AS client_phone,
            c.email AS client_email
        FROM Appointments a
        JOIN Clients c
            ON a.client_id = c.client_id
        ORDER BY a.appointment_date
    """)

    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return result


def get_appointments():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM Appointments
        ORDER BY appointment_date
    """)

    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return result


def create_client(client):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO Clients (name, phone, email)
        VALUES (%s, %s, %s)
        """,
        (
            client.name,
            client.phone,
            client.email,
        ),
    )

    conn.commit()

    client_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return {
        "message": "Client created successfully",
        "client_id": client_id,
    }


def create_appointment(appt):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO Appointments
        (client_id, appointment_date, service, status)
        VALUES (%s, %s, %s, %s)
        """,
        (
            appt.client_id,
            appt.appointment_date,
            appt.service,
            appt.status,
        ),
    )

    conn.commit()

    appointment_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return {
        "message": "Appointment booked successfully",
        "appointment_id": appointment_id,
    }