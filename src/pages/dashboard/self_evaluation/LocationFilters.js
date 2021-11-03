import $ from "jquery";
import _ from "lodash";
import React from "react";
import { injectIntl } from "react-intl";
import parse from "html-react-parser";
import { compose } from "redux";
import FieldSimpleSelect from "~/components/Form/FieldSimpleSelect";
import AccountsContainer from "~/containers/accounts";
import APIDataContainer from "~/containers/api_data";
import { getSelectOptions } from "~/helpers/get-select-options";
import { isStateAdmin } from "~/helpers/users";
import CONF from "~/api/index";
import { getUserToken } from "~/api/utils";
import axios from "axios";

export class LocationFilters extends React.Component {
  state = {
    provinces: [],
    states: [],
    cities: [],
    affiliations: [],
    hasCountries: false,
    geo_structure_level2_name: "",
    geo_structure_level3_name: "",
    geo_structure_level4_name: "",
    country_id: "",
    affiliation_id: "",
    hasUser: false,
  };

  updateGeographicElements = (country_id) => {
    const {
      geo_structure_level1_name,
      geo_structure_level2_name,
      geo_structure_level3_name,
      geo_structure_level4_name,
    } = this.props.apiData.countries.find(
      (country) => country._id.$oid === country_id
    );
    this.setState({
      geo_structure_level2_name,
      geo_structure_level3_name,
      geo_structure_level4_name,
    });
  };

  get direccionRegionalId() {
    return isStateAdmin(this.props.accounts.user)
      ? _.get(this.props, "accounts.user.direccion_regional_id.$oid")
      : $("select[name='region_id']").val();
  }

  componentDidMount() {
    this.props.fetchCountries();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.apiData.countries !== this.props.apiData.countries &&
      this.state.hasCountries === false
    ) {
      if (this.props.accounts.user.country_id) {
        this.updateGeographicElements(this.props.accounts.user.country_id.$oid);
        this.setState({ hasCountries: true });
      }
    }

    if (
      prevProps.accounts.user === this.props.accounts.user &&
      this.state.hasUser === false
    ) {
      const country_id =
        this.props.accounts.user &&
        this.props.accounts.user.country_id &&
        this.props.accounts.user.country_id.$oid;

      if (country_id && this.props.userProfile === "admin_country") {
        this.fetchAffiliations(country_id);
        this.setState({ hasUser: true });
      }
    }

    if (
      isStateAdmin(this.props.accounts.user) &&
      prevProps.apiData.isFetchingRegions !==
        this.props.apiData.isFetchingRegions &&
      !this.props.apiData.isFetchingRegions
    ) {
      const regions = this.props.apiData.regions;

      const selectedRegion = regions.find(
        (r) => r._id.$oid === this.direccionRegionalId
      );

      this.setState({
        provinces: selectedRegion ? selectedRegion.provincias : [],
      });
    }
  }

  translate(id) {
    return this.props.intl.formatMessage({ id });
  }

  clearSelects(fieldNames) {
    if (fieldNames && fieldNames.length > 0) {
      fieldNames.forEach((f) => {
        $(`select[name=${f}]`).prop("selectedIndex", 0);
      });
    }
  }

  async fetchAffiliations(country_id) {
    let URL_REQUEST =
      CONF.ApiURL +
      `/api/v1/institutions?country_id=${country_id}&access_token=${getUserToken()}`;
    if (this.props.userProfile === "admin_country") {
      URL_REQUEST =
        CONF.ApiURL + `/api/v1/institutions?access_token=${getUserToken()}`;
    }

    try {
      const response = await axios.get(URL_REQUEST);
      this.setState({ affiliations: response.data.data });
      return response.data.data;
    } catch (error) {
      this.setState({ affiliations: error.response.data.data });
      console.log(error.message);
    }
  }

  handleAffiliationChange(event) {
    const affiliation_id = event.target.value;
    this.setState({ affiliation_id });
    this.props.getAffiliationId && this.props.getAffiliationId(affiliation_id);
  }

  handleCountryChange(event) {
    const country_id = event.target.value;
    this.setState({ country_id });
    this.fetchAffiliations(country_id);
    this.props.getCountryId && this.props.getCountryId(country_id);
    this.clearSelects(["province_id", "state_id", "city_id"]);
  }

  handleProvinceChange(event) {
    const selectedProvinceValue = event.target.value;

    if (selectedProvinceValue === "") {
      this.setState({ states: [], cities: [] });
      return;
    }
    const schoolsFiltered = this.props.apiData.schools.filter((school) =>
      school.province_id.$oid
        ? school.province_id.$oid === selectedProvinceValue
        : school.province_id === selectedProvinceValue
    );

    const states = schoolsFiltered.map((school) => {
      return {
        value: school.state_id.$oid ? school.state_id.$oid : school.state_id,
        label: school.state_name,
        name: school.state_id.$oid ? school.state_id.$oid : school.state_id,
      };
    });

    const uniqueStates = [
      ...new Map(states.map((state) => [state.value, state])).values(),
    ];

    this.setState({ states: uniqueStates });
    this.props.updateProvince(selectedProvinceValue);
  }

  handleStateChange(event) {
    const selectedStateValue = event.target.value;
    this.props.updateState(selectedStateValue);
    if (selectedStateValue === "") {
      this.setState({ cities: [] });
      return;
    }
    const schoolsFiltered = this.props.apiData.schools.filter((school) =>
      school.state_id.$oid
        ? school.state_id.$oid === selectedStateValue
        : school.state_id === selectedStateValue
    );

    const cities = schoolsFiltered.map((school) => {
      return {
        value: school.city_id.$oid ? school.city_id.$oid : school.city_id,
        label: school.city_name,
        name: school.city_id.$oid ? school.city_id.$oid : school.city_id,
      };
    });

    const uniqueCities = [
      ...new Map(cities.map((city) => [city.value, city])).values(),
    ];
    this.setState({ cities: uniqueCities });
  }

  handleCityChange(event) {
    const selectedCityValue = event.target.value.$oid
      ? event.target.value.$oid
      : event.target.value;
    this.props.updateCity(selectedCityValue);
  }

  render() {
    const { provinces, affiliations } = this.state;
    const {
      apiData: {
        cities,
        isFetchingCitySchools,
        isFetchingRegions,
        isFetchingStateCities,
        isFetchingStates,
        isFetchingCountries,
        regions,
        countries,
        schools,
        states,
      },
      hideCountry,
      hideProvince,
      hideState,
      hideCity,
      hideAffiliation,
    } = this.props;

    return (
      <div>
        <div className="columns">
          {!isStateAdmin(this.props.accounts.user) && !hideCountry && (
            <div className="column">
              <FieldSimpleSelect
                name="country_id"
                label={this.translate("SignUpForm.label.region")}
                onChange={this.handleCountryChange.bind(this)}
                options={getSelectOptions(countries, "_id.$oid")}
                emptyOptionText={this.translate("SignUpForm.selectRegion")}
                loading={false}
                hiddenMargin
              />
            </div>
          )}

          {!isStateAdmin(this.props.accounts.user) && !hideAffiliation && (
            <div className="column">
              <FieldSimpleSelect
                name="affiliation_id"
                label={this.translate(
                  "DiagnosisTeacher.selfEvaluation.affiliation"
                )}
                onChange={this.handleAffiliationChange.bind(this)}
                options={getSelectOptions(affiliations, "_id.$oid")}
                emptyOptionText={this.translate("SignUpForm.selectRegion")}
                loading={false}
                hiddenMargin
              />
            </div>
          )}
          {!hideProvince && (
            <div className="column">
              <FieldSimpleSelect
                name="province_id"
                label={
                  this.state.geo_structure_level2_name === ""
                    ? this.translate("SignUpForm.label.province")
                    : this.state.geo_structure_level2_name
                }
                onChange={this.handleProvinceChange.bind(this)}
                options={this.props.provincesList}
                emptyOptionText={this.translate("SignUpForm.selectProvince")}
                // disabled={
                //   !isStateAdmin(this.props.accounts.user) &&
                //   !$("select[name='region_id']").val()
                // }
                loading={isFetchingRegions}
                hiddenMargin
              />
            </div>
          )}

          {!hideState && (
            <div className="column">
              <FieldSimpleSelect
                name="state_id"
                label={
                  this.state.geo_structure_level3_name === ""
                    ? this.translate("SignUpForm.label.state")
                    : this.state.geo_structure_level3_name
                }
                onChange={this.handleStateChange.bind(this)}
                options={this.state.states}
                emptyOptionText={this.translate("SignUpForm.selectState")}
                disabled={!$("select[name='province_id']").val()}
                loading={isFetchingStates}
                hiddenMargin
              />
            </div>
          )}

          {!hideCity && (
            <div className="column">
              <FieldSimpleSelect
                name="city_id"
                label={
                  this.state.geo_structure_level4_name === ""
                    ? this.translate("SignUpFormPrincipalFields.label.city")
                    : this.state.geo_structure_level4_name
                }
                onChange={this.handleCityChange.bind(this)}
                options={this.state.cities}
                emptyOptionText={this.translate(
                  "SignUpFormPrincipalFields.selectCity"
                )}
                disabled={
                  !$("select[name='province_id']").val() ||
                  !$("select[name='state_id']").val()
                }
                loading={isFetchingStateCities}
                hiddenMargin
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(
  compose(APIDataContainer, AccountsContainer)(LocationFilters)
);
