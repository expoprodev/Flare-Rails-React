import * as React from "react";

import { Routes, Route } from "react-router-dom";
import EditCoupon from "../Coupons/EditCoupon";
import { ListCoupons } from "../Coupons/ListCoupons";
import { NewCoupon } from "../Coupons/NewCoupon";

import ListMemberships from "../Memberships/ListMemberships";
import NewMembership from "../Memberships/NewMembership";
import ShowMembership from "../Memberships/ShowMembership";
import EditPlan from "../Plans/EditPlan";
import ListPlans from "../Plans/ListPlans";
import NewPlan from "../Plans/NewPlan";
import ShowPlan from "../Plans/ShowPlan";
import EditReader from "../Readers/EditReader";
import ListReaders from "../Readers/ListReaders";
import NewReader from "../Readers/NewReader";
import ActivityScreen from "../screens/activity-screen";
import EditTaskRate from "../TaxRates/EditTaxRate";
import ListTaxRates from "../TaxRates/ListTaxRates";
import NewTaxRate from "../TaxRates/NewTaxRate";
import ListUsers from "../Users/ListUsers";
import EditUser from "../Users/EditUser";
import InviteUser from "../Users/InviteUser";
import ListLocations from "../Locations/ListLocations";
import EditLocation from "../Locations/EditLocation";
import NewLocation from "../Locations/NewLocation";
import ListResponses from "../Responses/ListResponses";
import NewResponse from "../Responses/NewResponse";
import EditResponse from "../Responses/EditResponse";
import ListReports from "../Reports/ListReports";
import NewReport from "../Reports/NewReport";
import ShowBilling from "../Billing/ShowBilling";
import EditCompany from "../Company/EditCompany";
import ListDisputes from "../Disputes/ListDisputes";

function Navigation() {
  return (
    <Routes>
      <Route path="/" element={<ListMemberships />} />
      <Route path="/dashboard" element={<ActivityScreen />} />
      {/* Coupons */}
      <Route path="/coupons" element={<ListCoupons />} />
      <Route path="/coupons/:id/edit" element={<EditCoupon />} />
      <Route path="/coupons/new" element={<NewCoupon />} />
      {/* Members */}
      <Route path="/memberships" element={<ListMemberships />} />
      <Route path="/memberships/:id" element={<ShowMembership />} />
      <Route path="/memberships/new" element={<NewMembership />} />
      {/* Disputes */}
      <Route path="/disputes" element={<ListDisputes />} />
      {/* Plans */}
      <Route path="/plans" element={<ListPlans />} />
      <Route path="/plans/:id/edit" element={<EditPlan />} />
      <Route path="/plans/new" element={<NewPlan />} />
      {/* Tax Rates */}
      <Route path="/tax_rates" element={<ListTaxRates />} />
      <Route path="/tax_rates/:id/edit" element={<EditTaskRate />} />
      <Route path="/tax_rates/new" element={<NewTaxRate />} />
      {/* Readers */}
      <Route path="/readers" element={<ListReaders />} />
      <Route path="/readers/:id/edit" element={<EditReader />} />
      <Route path="/readers/new" element={<NewReader />} />

      {/* Users */}
      <Route path="/users" element={<ListUsers />} />
      <Route path="/users/:id/edit" element={<EditUser />} />
      <Route path="/users/new" element={<InviteUser />} />

      {/* Locations */}
      <Route path="/locations" element={<ListLocations />} />
      <Route path="/locations/:id/edit" element={<EditLocation />} />
      <Route path="/locations/new" element={<NewLocation />} />

      {/* Responses */}
      <Route path="/responses" element={<ListResponses />} />
      <Route path="/responses/:id/edit" element={<EditResponse />} />
      <Route path="/responses/new" element={<NewResponse />} />

      {/* Reports */}
      <Route path="/reports" element={<ListReports />} />
      <Route path="/reports/new" element={<NewReport />} />
      {/* Billing */}
      <Route path="/settings" element={<ShowBilling />} />

      <Route path="/companies/:id/edit" element={<EditCompany />} />
    </Routes>
  );
}

export default Navigation;
