export function set_school_form_data(fields, school) {
  if (school._id) {
    fields._id.onChange(school._id.$oid);
  }
  fields.name.onChange(school.name);
  fields.unique_code.onChange(school.unique_code);

  fields.country_id.onChange(school.country_id.$oid);
  fields.country_name.onChange(school.country_name);
  fields.province_id.onChange(school.province_id.$oid || school.province_id);
  fields.province_name.onChange(school.province_name);
  fields.state_id.onChange(school.state_id.$oid || school.state_id);
  fields.state_name.onChange(school.state_name);
  fields.city_id.onChange(school.city_id.$oid || school.city_id);
  fields.city_name.onChange(school.city_name);

  fields.staff_count.onChange(school.staff_count);
  fields.student_diurnal_count.onChange(school.student_diurnal_count);
  fields.student_vespertine_count.onChange(school.student_vespertine_count);
  fields.student_nocturnal_count.onChange(school.student_nocturnal_count);
  fields.student_full_count.onChange(school.student_full_count);
  if (school.manager_id) {
    fields.manager.onChange(school.manager_id.$oid);
  }
  fields.location_type.onChange(school.location_type);
  fields.regional.onChange(school.regional);
  fields.observations.onChange(school.observations);

  const classesList = [
    "kindergarten",
    "elementary_1",
    "elementary_2",
    "highschool",
    "technical",
    "adult",
  ];
  classesList.forEach((propt) => {
    fields[propt].onChange(school[propt]);
    if (school[propt]) {
      document.getElementById(fields[propt].name).checked = true;
    }
    if (school.school_classe && school.school_classe[propt] !== null) {
      for (let [k, v] of Object.entries(school.school_classe[propt])) {
        if (typeof v === "object") {
          for (let [k2, v2] of Object.entries(v)) {
            fields.school_classe[propt][k][k2].onChange(v2);
          }
        }
      }
    }
  });
  if (school.school_infra) {
    fields.school_infra.comp_admins.onChange(
      school.school_infra.comp_admins || 0
    );
    fields.school_infra.comp_teachers.onChange(
      school.school_infra.comp_teachers || 0
    );
    fields.school_infra.comp_students.onChange(
      school.school_infra.comp_students || 0
    );
    fields.school_infra.printers.onChange(school.school_infra.printers || 0);
    fields.school_infra.rack.onChange(school.school_infra.rack || 0);
    fields.school_infra.nobreak.onChange(school.school_infra.nobreak || 0);
    fields.school_infra.switch.onChange(school.school_infra.switch || 0);
    fields.school_infra.firewall.onChange(school.school_infra.firewall || 0);
    fields.school_infra.wifi.onChange(school.school_infra.wifi || 0);
    fields.school_infra.projector.onChange(school.school_infra.projector || 0);
    fields.school_infra.charger.onChange(school.school_infra.charger || 0);
    fields.school_infra.maker.onChange(school.school_infra.maker || 0);
  }
  return fields;
}

export function assemble_school_form_json(values) {
  if (!values.kindergarten) values.school_classe.kindergarten = null;
  if (!values.elementary_1) values.school_classe.elementary_1 = null;
  if (!values.elementary_2) values.school_classe.elementary_2 = null;
  if (!values.highschool) values.school_classe.highschool = null;
  if (!values.technical) values.school_classe.technical = null;
  if (!values.adult) values.school_classe.adult = null;
  return { ...values };
}
