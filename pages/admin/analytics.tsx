import PageWrapper from "@/composedComponents/PageWrapper";
import withProfile from "@/HOC/withProfile";
import withAdmin from "@/HOC/withAdmin";
import withAuth from "@/HOC/withAuth";
import AnalyticsCard from "@/composedComponents/AnalyticsCard/AnalyticsCard";
export const dynamic = "force-dynamic";

function Analytics() {
  // States

  // Mounted

  return (
    <>
      <PageWrapper admin path="discover">
        <div className="mb-20">
          <h2 className="m-0">Analytics</h2>
        </div>
        <div>
          <h3>Users</h3>
          <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
            <AnalyticsCard name="Total Users" value={10}></AnalyticsCard>
            <AnalyticsCard name="New Users" value={10}></AnalyticsCard>
          </div>
        </div>
        <div style={{ marginTop: "34px" }}>
          <h3>Subscriptions</h3>
          <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
            <AnalyticsCard name="Free" value={10}></AnalyticsCard>
            <AnalyticsCard name="Premium" value={10}></AnalyticsCard>
            <AnalyticsCard name="Premium Plus" value={10}></AnalyticsCard>
            <AnalyticsCard name="Organizational" value={10}></AnalyticsCard>
          </div>
        </div>
        <div style={{ marginTop: "34px" }}>
          <h3>Stories</h3>
          <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
            <AnalyticsCard name="Stories" value={10}></AnalyticsCard>
            <AnalyticsCard name="Minutes Listened" value={10}></AnalyticsCard>
            <AnalyticsCard name="Minutes Recorded" value={10}></AnalyticsCard>
            <AnalyticsCard name="Languages" value={10}></AnalyticsCard>
          </div>
        </div>
        <div style={{ marginTop: "34px" }}>
          <h3>Collections</h3>
          <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
            <AnalyticsCard name="Collections" value={10}></AnalyticsCard>
            <AnalyticsCard name="Private Collections" value={10}></AnalyticsCard>
            <AnalyticsCard name="Shared Collections" value={10}></AnalyticsCard>
            <AnalyticsCard name="Total Listeners" value={10}></AnalyticsCard>
            <AnalyticsCard name="Stories added to Collections" value={10}></AnalyticsCard>
          </div>
        </div>
        <div style={{ marginTop: "34px", marginBottom: "50px" }}>
          <h3>Discover</h3>
          <div>
            <AnalyticsCard
              name="Stories submitted to public for sharing"
              value={10}
            ></AnalyticsCard>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

export default withAuth(withProfile(withAdmin(Analytics)));
