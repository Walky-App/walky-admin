
import GlobalTable from "@/components/shared/GlobalTable";

const fetchFacilityData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/facilities`);
    const facilityData = await response.json();
    return facilityData;
};

export default async function FacilitiesPage() {

    const facilityData = await fetchFacilityData();

    const facilityColumns = [
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: "Address",
            accessor: "address",
        },
        {
            Header: "Phone Number",
            accessor: "phone_number",
        },
        {
            Header: "City",
            accessor: "city",
        },
        {
            Header: "State",
            accessor: "state",
        },
        {
            Header: "Zip",
            accessor: "zip",
        },
        {
            Header: "Country",
            accessor: "country",
        },

    ];

    return (
        <div className="flex flex-col gap-4">
            <GlobalTable data={facilityData} columns={facilityColumns} />
        </div>
    );
}