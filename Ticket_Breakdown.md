# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here
* Assumptions: 
    * Any Agent can be assigned to work in any facility.
    * Each Facility can only have one (1) Custom Id per Agent.
    * The Custom ID doesn't change in any way by Shift.
### Ticket 1.

* User Story: **As a Facility, I want to add my own custom id for any Agent I work with**
* Acceptance Criteria:
    * Scenario: The Facility tries to add a custom id for an Agent.
        * Given no custom id preexisting for the Agent passed as parameter, with the Facility that calls the function, when trying to create the custom id for an Agent, Then save the custom ID for this Facility.
        * Given an Agent with an existing Custom Id for a Facility, when the Facility tries to add a new Custom Id for the Agent, Then return an error Message stating that there is already a Custom ID.
        * Given a Custom Id passed as parameter for an Agent, when the Agent does not have a Custom Id, but the Custom Id passed already is assigned to a different Agent, Then return an error stating that the Custom ID is already assigned.
* Time/effort estimates: 
    * Story Points: 2
* Implementation: 
    * Create a new Table as an interection between Facilities and Agents, called facilities_custom_agent_data, containing the following columns:
        * Facility_id To represent the relationship with the Facilities Table
        * Agent_id To represent the relationship with the Agents Table
        * custom_agent_id To represent the new Field.
    * Create a POST endpoint with path: `/facility/{facilityId}/agent/{agentId}`
    that will be able to receive a JSON in format 
    ``
    {
        "custom_agent_id": 123456
    }``
    * Use the `custom_agent_id`, `facilityId`, `agentId` to try and insert the data into the newly created table. If there's a collition then return an error. Else return the mapping object with the newly added Custom Agent Id, the Agent Name, the Agent Id and the Facility ID.
        
### Ticket 2.

* User Story: **As a Facility, I want to be able to modify the custom id for any Agent I work with, If the Agent I chose does not have a Custom Id, then save the 'updating' Custom id**
* Prerrequisites: Ticket 1.
* Time/effort estimates: 
    * Story Points: 1
* Assumptions: We want the UPDATE to feel like an 'Upsert'. So in case of trying to update the information but not finding any preexisting data, then create it
* Acceptance Criteria:
    * Scenario: The Facility tries to edit a custom id for an Agent.
        * Given no custom id preexisting for the Agent passed as parameter, with the Facility that calls the function, when trying to create the custom id for an Agent, Then save the custom ID for this Facility.
        * Given an Agent with an existing Custom Id for a Facility, when the Facility tries to add a new Custom Id for the Agent, Then replace the Custom Id, with the one passed as parameter.
        * Given a Custom Id passed as parameter for an Agent, WHEN the Custom Id passed already is assigned to a different Agent, Then return an error stating that the Custom ID is already assigned.
* Implementation: 
    * Create a PUT endpoint with path: `/facility/{facilityId}/agent/{agentId}`
    that will be able to receive a JSON in format 
    ``
    {
        "custom_agent_id": 123456
    }``
    * Use the `custom_agent_id`, `facilityId`, `agentId` to try and INSERT  the data into the newly created table with the flag ON CONFLICT. If there's a collition then the conflict will trigger and will DO an update. If there's no conflict then return the mapping object with the newly added Custom Agent Id, the Agent Name, the Agent Id and the Facility ID.
### Ticket 3.

* User Story: **As a Facility, I want to be able to see all the custom ids for any Agent that I've assigned**
* Prerrequisites: Ticket 1.
* Time/effort estimates: 
    * Story Points: 1
* Acceptance Criteria:
    * Scenario: The Facility tries to get all the custom ids.
        * Given no custom ids linked to the Facility, when trying to retrieve them, then return an empty list.
        * Given a set of custom Ids linked to the Facility, when trying to retrieve them, then show them matched to the Agent, in a tuple of the form InternalId - AgentName - CustomId.
* Implementation: 
    * Create a GET endpoint with path: `/facility/{facilityId}/agent/customId`
    * Use the `facilityId` to query for all the Agent Custom Ids in the DB, and, using the Agents Table, create a complete matching object for InternalAgentId, AgentName and CustomAgentId .

### Ticket 4.

* User Story: **As a Facility, I want to be able to see all the custom ids for any Agent that I've assigned**
* Prerrequisites: Ticket 1.
* Time/effort estimates: 
    * Story Points: 1
* Acceptance Criteria:
    * Scenario: The Facility tries to delete a custom agent id.
        * Given no custom_agent_id linked to the Facility matching the parameter, when trying to delete it, then return a Not Found error.
        * Given a custom_agent_id linked to the Facility matching the parameter, when trying to delete it, then remove it from DB and return an OK message.
* Implementation: 
    * Create a DELETE endpoint with path: `/facility/{facilityId}/agent/custom/{customAgentId}`
    * Use the `customAgentId` to query for the Agent Custom Ids in the DB, if found, then delete it, else return an error.

### Ticket 5.

* User Story: **As a Facility, I want to see in my reports the Custom Agent ID for any Agent that I've assigned, if an Agent does not have a Custom Id assigned then show the internal ID**
* Prerrequisites: 
    * Ticket 1.
    * Ticket 3.
* Time/effort estimates: 
    * Story Points: 2
* Acceptance Criteria:
    * Scenario: The Facility generates a Report for the shifts worked.
        * Given no custom ids linked to any Agent by the Facility, when trying to generate the Report, then generate the report with the Internal Agent Id.
        * Given custom Ids linked to Agents by the Facility, when trying to generate the Report, then replace the AgentId field with the Internal Agent Id.
* Implementation: 
    * Using the middle functionality created in the Ticket 3, retrieve all the Agents and their custom Ids assigned by the facility
    * When Generating the Report. Look for the Agent Id in the array retrieved in the last step. If it exists then replace on the report with the Custom Agent Id found in the array.
