# Haya MVP - Database Schema Reference

This document provides a comprehensive reference of the Supabase database schema for the Haya MVP application. It includes details of all tables, columns, relationships, and access policies to serve as a guide for application development.

## Table of Contents

1. [Accommodations](#accommodations)
2. [Agent Logs](#agent_logs)
3. [Agents](#agents)
4. [AI Assistants](#ai_assistants)
5. [Booking Items](#booking_items)
6. [Bookings](#bookings)
7. [Conversation Messages](#conversation_messages)
8. [Conversations](#conversations)
9. [Customers](#customers)
10. [Experiences](#experiences)
11. [Knowledge Base](#knowledge_base)
12. [Messages](#messages)
13. [Models Config](#models_config)
14. [Organization Users](#organization_users)
15. [Organizations](#organizations)
16. [Payments](#payments)
17. [Tours](#tours)
18. [User Profiles](#user_profiles)

## Database Entity Relationship Diagram

```
Organizations ----|--< Organization Users >--|- User Profiles
      |
      |-----< Agents
      |-----< AI Assistants
      |-----< Accommodations
      |-----< Experiences
      |-----< Tours >----------|
      |                        |
      |-----< Customers >------|--< Bookings >---< Booking Items
      |           |            |        |
      |           |            |        |-----< Payments
      |           |            |
      |           |--< Conversations >--< Conversation Messages
      |           |
      |           |--< Messages
      |
      |-----< Knowledge Base
      |-----< Models Config
```

## Table Details

<a name="accommodations"></a>
### Accommodations

Stores information about lodging options that can be included in tours.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization that owns this accommodation
- `name` (text): Name of the accommodation
- `type` (text): Type of accommodation (e.g., hotel, hostel, apartment)
- `description` (text): Detailed description
- `location` (text): Physical location
- `contact` (text): Contact information
- `images` (text[]): Array of image URLs
- `pricing` (jsonb): Flexible pricing structure
- `amenities` (text[]): Array of available amenities
- `availability` (jsonb): Availability information
- `is_active` (boolean): Whether this accommodation is currently available
- `meta_data` (jsonb): Additional flexible data
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Foreign Keys:**
- `org_id` references `organizations(id)` with cascade delete

**RLS Policies:**
- Access restricted to members of the same organization

<a name="agent_logs"></a>
### Agent Logs

Tracks activities and operations performed by AI agents.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `agent_id` (uuid, FK): Reference to the agent
- `org_id` (uuid): Organization ID
- `event` (text): Type of event logged
- `details` (jsonb): Detailed information about the event
- `created_at` (timestamp with time zone): When the event occurred

**Foreign Keys:**
- `agent_id` references `agents(id)` with cascade delete

**RLS Policies:**
- Access restricted to members of the same organization

<a name="agents"></a>
### Agents

Stores configuration information for AI agents used in the system.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization that owns this agent
- `name` (text): Name of the agent
- `type` (text): Type of agent (e.g., booking, customer service)
- `description` (text): Description of the agent's purpose
- `configuration` (jsonb): Agent configuration parameters
- `state` (jsonb): Current operational state
- `memory_json` (jsonb): Memory/context for the agent
- `is_active` (boolean): Whether this agent is currently active
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Foreign Keys:**
- `org_id` references `organizations(id)` with cascade delete

**RLS Policies:**
- Access restricted to members of the same organization

<a name="ai_assistants"></a>
### AI Assistants

Stores configuration for AI assistants that can be used across different parts of the application.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization that owns this assistant
- `name` (text): Name of the assistant
- `description` (text): Description of the assistant's purpose
- `model` (text): AI model being used
- `system_prompt` (text): Base system prompt for the assistant
- `knowledge_ids` (uuid[]): References to knowledge base entries
- `capabilities` (text[]): Array of assistant capabilities
- `is_active` (boolean): Whether this assistant is currently active
- `settings` (jsonb): Additional configuration settings
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Foreign Keys:**
- `org_id` references `organizations(id)` with cascade delete

**RLS Policies:**
- Access restricted to members of the same organization

<a name="booking_items"></a>
### Booking Items

Contains individual line items within a booking, such as accommodations, experiences, or other services.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `booking_id` (uuid, FK): Reference to the parent booking
- `item_type` (text): Type of item (accommodation, experience, etc.)
- `resource_id` (uuid): Reference to the resource (may be in different tables)
- `quantity` (integer): Quantity of this item
- `unit_price` (numeric(10,2)): Price per unit
- `total_price` (numeric(10,2)): Total price for this line item
- `details` (jsonb): Additional details about this item
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Foreign Keys:**
- `booking_id` references `bookings(id)` with cascade delete

**RLS Policies:**
- Access restricted based on parent booking's organization

<a name="bookings"></a>
### Bookings

Stores main booking information for tours and travel packages.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization that owns this booking
- `tour_id` (uuid, FK): Reference to the tour being booked
- `customer_id` (uuid, FK): Reference to the customer making the booking
- `num_participants` (integer): Number of people in the booking
- `total_price` (numeric(10,2)): Total price of the booking
- `status` (text): Current status (e.g., pending, confirmed, cancelled)
- `special_requests` (text): Customer's special requests
- `payment_status` (text): Payment status (e.g., unpaid, partially paid, paid)
- `payment_id` (uuid): Reference to a payment record
- `confirmation_code` (text): Booking confirmation code
- `start_date` (timestamp with time zone): Start date of the booking
- `end_date` (timestamp with time zone): End date of the booking
- `meta_data` (jsonb): Additional flexible data
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Indexes:**
- Primary key on `id`
- Index on `customer_id`
- Index on `start_date` and `end_date`
- Index on `org_id`
- Index on `status`
- Index on `tour_id`

**Foreign Keys:**
- `customer_id` references `customers(id)`
- `org_id` references `organizations(id)` with cascade delete
- `tour_id` references `tours(id)`

**Referenced By:**
- `booking_items(booking_id)`
- `payments(booking_id)`

**RLS Policies:**
- Access restricted to members of the same organization

**Triggers:**
- `update_bookings_timestamp`: Updates the `updated_at` field on changes

<a name="conversation_messages"></a>
### Conversation Messages

Stores individual messages within conversations.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `conversation_id` (uuid, FK): Reference to the parent conversation
- `sender_type` (text): Type of sender (human, ai, system)
- `content` (text): Message content
- `metadata` (jsonb): Additional message metadata
- `created_at` (timestamp with time zone): When the message was sent

**Foreign Keys:**
- `conversation_id` references `conversations(id)` with cascade delete

**RLS Policies:**
- Access restricted based on parent conversation's organization

<a name="conversations"></a>
### Conversations

Tracks conversation threads between customers, staff, and AI assistants.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization
- `customer_id` (uuid, FK): Reference to the customer (if applicable)
- `agent_id` (uuid): Reference to an AI agent (if applicable)
- `user_id` (uuid): Reference to a staff user (if applicable)
- `title` (text): Conversation title
- `status` (text): Current status
- `channel` (text): Communication channel
- `metadata` (jsonb): Additional conversation metadata
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Foreign Keys:**
- `customer_id` references `customers(id)`
- `org_id` references `organizations(id)` with cascade delete

**RLS Policies:**
- Access restricted to members of the same organization

<a name="customers"></a>
### Customers

Stores customer information.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization
- `name` (text): Customer's name
- `email` (text): Customer's email address
- `phone` (text): Customer's phone number
- `address` (text): Customer's address
- `preferences` (jsonb): Customer preferences
- `tags` (text[]): Tags/categories for this customer
- `metadata` (jsonb): Additional customer metadata
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Foreign Keys:**
- `org_id` references `organizations(id)` with cascade delete

**Referenced By:**
- `bookings(customer_id)`
- `conversations(customer_id)`
- `messages(customer_id)`

**RLS Policies:**
- Access restricted to members of the same organization

<a name="experiences"></a>
### Experiences

Stores information about tour experiences that can be included in packages.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization
- `name` (text): Name of the experience
- `description` (text): Detailed description
- `location` (text): Physical location
- `duration` (interval): Duration of the experience
- `images` (text[]): Array of image URLs
- `tags` (text[]): Categorization tags
- `pricing` (jsonb): Pricing structure
- `is_active` (boolean): Whether this experience is currently available
- `vector_embedding` (vector): Vector embedding for semantic search
- `metadata` (jsonb): Additional experience metadata
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Foreign Keys:**
- `org_id` references `organizations(id)` with cascade delete

**RLS Policies:**
- Access restricted to members of the same organization

<a name="knowledge_base"></a>
### Knowledge Base

Stores knowledge base entries used by AI assistants.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization
- `title` (text): Title of the knowledge entry
- `content` (text): Content of the knowledge entry
- `source` (text): Source of the information
- `tags` (text[]): Categorization tags
- `vector_embedding` (vector): Vector embedding for semantic search
- `metadata` (jsonb): Additional metadata
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Foreign Keys:**
- `org_id` references `organizations(id)` with cascade delete

**RLS Policies:**
- Access restricted to members of the same organization

<a name="messages"></a>
### Messages

Stores messages sent to and from customers via various channels.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization
- `customer_id` (uuid, FK): Reference to the customer
- `channel` (text): Communication channel (SMS, email, etc.)
- `direction` (text): Inbound or outbound
- `content` (text): Message content
- `status` (text): Delivery status
- `metadata` (jsonb): Additional message metadata
- `created_at` (timestamp with time zone): When the message was sent/received

**Foreign Keys:**
- `customer_id` references `customers(id)`
- `org_id` references `organizations(id)` with cascade delete

**RLS Policies:**
- Access restricted to members of the same organization

<a name="models_config"></a>
### Models Config

Configuration settings for AI models used in the system.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization
- `agent_type` (text): Type of agent this configuration applies to
- `model_provider` (text): AI model provider (OpenAI, Anthropic, etc.)
- `model_name` (text): Name of the specific model
- `configuration` (jsonb): Configuration parameters
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Foreign Keys:**
- `org_id` references `organizations(id)` with cascade delete

**RLS Policies:**
- Access restricted to members of the same organization

<a name="organization_users"></a>
### Organization Users

Links users to organizations, establishing the multi-tenant structure.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `organization_id` (uuid, FK): Reference to the organization
- `user_id` (uuid, FK): Reference to the user
- `role` (text): User's role within the organization
- `created_at` (timestamp with time zone): When the user was added to the organization

**Indexes:**
- Primary key on `id`
- Unique constraint on `(organization_id, user_id)`

**Foreign Keys:**
- `organization_id` references `organizations(id)` with cascade delete
- `user_id` references `user_profiles(id)` with cascade delete

**RLS Policies:**
- Restricted access based on user's membership in organizations

<a name="organizations"></a>
### Organizations

Stores core information about tenant organizations.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `name` (text): Organization name
- `slug` (text): URL-friendly identifier
- `description` (text): Organization description
- `website` (text): Organization website
- `contact_email` (text): Primary contact email
- `contact_phone` (text): Primary contact phone
- `subscription_status` (text): Subscription status
- `subscription_tier` (text): Subscription tier/plan
- `trial_ends_at` (timestamp with time zone): When trial period ends
- `metadata` (jsonb): Additional organization metadata
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Indexes:**
- Primary key on `id`
- Unique constraint on `slug`

**Referenced By:**
- Many tables with `org_id` foreign keys

**RLS Policies:**
- Access restricted to members of the organization

<a name="payments"></a>
### Payments

Stores payment transaction records.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `booking_id` (uuid, FK): Reference to the booking
- `customer_id` (uuid, FK): Reference to the customer
- `amount` (numeric(10,2)): Payment amount
- `currency` (text): Currency code
- `status` (text): Payment status
- `method` (text): Payment method
- `transaction_id` (text): External payment processor transaction ID
- `invoice_url` (text): URL to invoice
- `metadata` (jsonb): Additional payment metadata
- `created_at` (timestamp with time zone): When the payment was made

**Foreign Keys:**
- `booking_id` references `bookings(id)`
- `customer_id` references `customers(id)`

**RLS Policies:**
- Access restricted based on related booking's organization

<a name="tours"></a>
### Tours

Stores information about tour packages.

**Columns:**
- `id` (uuid, PK): Unique identifier, auto-generated
- `org_id` (uuid, FK): Reference to the organization
- `title` (text): Tour title
- `description` (text): Detailed tour description
- `itinerary_json` (jsonb): Structured itinerary
- `images` (text[]): Array of image URLs
- `duration` (interval): Tour duration
- `base_price` (numeric(10,2)): Base price per person
- `location` (text): Primary location
- `tags` (text[]): Categorization tags
- `max_participants` (integer): Maximum number of participants
- `is_published` (boolean): Whether this tour is published/visible
- `metadata` (jsonb): Additional tour metadata
- `created_at` (timestamp with time zone): Creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Foreign Keys:**
- `org_id` references `organizations(id)` with cascade delete

**Referenced By:**
- `bookings(tour_id)`

**RLS Policies:**
- Access restricted to members of the same organization

<a name="user_profiles"></a>
### User Profiles

Stores information about system users (staff, admins).

**Columns:**
- `id` (uuid, PK): Unique identifier, linked to Auth user ID
- `email` (text): User's email address
- `full_name` (text): User's full name
- `avatar_url` (text): URL to user's avatar image
- `onboarding_completed` (boolean): Whether onboarding is complete
- `preferences` (jsonb): User preferences
- `last_login` (timestamp with time zone): Last login timestamp
- `created_at` (timestamp with time zone): Account creation timestamp
- `updated_at` (timestamp with time zone): Last update timestamp

**Referenced By:**
- `organization_users(user_id)`

**RLS Policies:**
- Users can only access their own profiles

## Row Level Security (RLS) Policies

All tables in this database implement Row Level Security (RLS) policies to ensure data separation between tenant organizations. The core security principle is:

1. Most tables have an `org_id` column linking them to an organization
2. Users can only access data where:
   - They are members of the organization (via the `organization_users` table)
   - Or they own the data directly (for user_profiles)

This multi-tenant architecture ensures data isolation between different client organizations while allowing admins to access data across the platform.

## Common Database Patterns

1. **Timestamps**: Most tables include `created_at` and `updated_at` columns for auditing
2. **Soft Delete**: Some tables implement soft deletion via an `is_active` boolean
3. **JSON Flexibility**: JSONB columns like `metadata` allow for flexible data storage without schema changes
4. **Vector Embeddings**: Tables like `experiences` and `knowledge_base` include vector embeddings for AI search
5. **Multi-tenancy**: The `org_id` column and associated RLS policies maintain tenant data isolation

## Notes for Developers

- Always query tables through the Supabase client to ensure RLS policies are enforced
- Include the appropriate `org_id` when inserting new records
- Use the JSONB columns for flexible data without requiring schema migrations
- Consider performance implications when querying large tables
- Make use of the indexes on frequently queried columns
