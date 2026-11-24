-- =====================================================================
-- TECHNOFORUM CENTRALIZED PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- BIRLA INSTITUTE OF APPLIED SCIENCES (BIAS), BHIMTAL
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. USERS & ROLES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'coordinator', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for instant lookup by roll number or email
CREATE INDEX IF NOT EXISTS idx_users_roll_number ON public.users(roll_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ---------------------------------------------------------------------
-- 2. EVENTS & PARTICIPATION TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Technical',
    date DATE NOT NULL,
    time VARCHAR(100),
    venue VARCHAR(255) NOT NULL,
    description TEXT,
    max_participants INTEGER DEFAULT 100,
    registration_deadline DATE,
    banner_url TEXT,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    team_members JSONB DEFAULT '[]'::jsonb,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_roll_number ON public.event_registrations(roll_number);

-- ---------------------------------------------------------------------
-- 3. HARDWARE INVENTORY MANAGEMENT
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'General Components',
    quantity_total INTEGER NOT NULL DEFAULT 1,
    quantity_available INTEGER NOT NULL DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'pcs',
    serial_prefix VARCHAR(50) NOT NULL,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'out_of_stock')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique Serial Items (Extension boards, Arduino kits with unique barcode stickers)
CREATE TABLE IF NOT EXISTS public.inventory_tracked_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    serial_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. BIAS-EXT-001
    condition VARCHAR(50) DEFAULT 'working' CHECK (condition IN ('working', 'damaged', 'missing')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions / Student Issue Logs
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES public.inventory_items(id),
    serial_number VARCHAR(100),
    student_roll_number VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    return_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    returned_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'damaged', 'missing', 'overdue')),
    remarks TEXT,
    issued_by VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_inventory_tx_roll_number ON public.inventory_transactions(student_roll_number);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_status ON public.inventory_transactions(status);

-- ---------------------------------------------------------------------
-- 4. E-CERTIFICATES & VERIFICATION REGISTRY
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id VARCHAR(100) UNIQUE NOT NULL, -- e.g. TF-2026-TH-0001
    student_name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    event_title VARCHAR(255) NOT NULL,
    position VARCHAR(100) DEFAULT 'Participant',
    issue_date DATE DEFAULT CURRENT_DATE,
    certificate_pdf_url TEXT,
    verification_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Verified Valid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON public.certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_certificates_roll_number ON public.certificates(roll_number);
CREATE INDEX IF NOT EXISTS idx_certificates_name ON public.certificates(student_name);

-- ---------------------------------------------------------------------
-- 5. ANNOUNCEMENTS & FLYERS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    content TEXT NOT NULL,
    flyer_url TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    author VARCHAR(255) DEFAULT 'Technoforum Coordinator',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- INITIAL SEED DATA FOR TESTING
-- =====================================================================
INSERT INTO public.inventory_items (name, category, quantity_total, quantity_available, unit, serial_prefix)
VALUES 
('Arduino Uno R3 Dev Board', 'Microcontrollers', 25, 20, 'pcs', 'BIAS-ARD'),
('Heavy Duty 4-Way Extension Cord (10m)', 'Power & Tools', 10, 6, 'pcs', 'BIAS-EXT'),
('HC-SR04 Ultrasonic Distance Sensor', 'Sensors', 40, 35, 'pcs', 'BIAS-SEN-US'),
('10k Ohm Metal Film Resistors (Pack of 10)', 'Passive Components', 100, 85, 'packs', 'BIAS-RES-10K')
ON CONFLICT DO NOTHING;

INSERT INTO public.certificates (certificate_id, student_name, roll_number, event_title, position, issue_date)
VALUES
('TF-2026-TH-001', 'Aarav Sharma', '230101', 'TechnoHacks 2026 Flagship Hackathon', 'First Runner Up', '2026-11-20'),
('TF-2026-RQ-042', 'Priya Verma', '230142', 'RoboQuest 2026 Autonomous Robotics', 'Participant', '2026-11-15')
ON CONFLICT DO NOTHING;
