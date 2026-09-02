export interface PermissionMeta {
  category: string;
  label: string;
}

export const PERMISSION_META: Record<string, PermissionMeta> = {
  add_hotel: { category: "Hotel", label: "Add" },
  edit_hotel: { category: "Hotel", label: "Edit" },
  delete_hotel: { category: "Hotel", label: "Delete" },
  view_hotel: { category: "Hotel", label: "View" },

  add_room: { category: "Room", label: "Add" },
  edit_room: { category: "Room", label: "Edit" },
  delete_room: { category: "Room", label: "Delete" },
  view_room: { category: "Room", label: "View" },

  view_booking: { category: "Booking", label: "View" },
  add_booking: { category: "Booking", label: "Add" },
  change_booking_status: { category: "Booking", label: "Change Status" },
  cancel_booking: { category: "Booking", label: "Cancel" },
  view_my_booking: { category: "Booking", label: "View My" },

  view_dashboard: { category: "Dashboard", label: "View" },

  view_amenities: { category: "Amenities", label: "View" },
  edit_amenities: { category: "Amenities", label: "Edit" },

  view_image_gallery: { category: "Image Gallery", label: "View" },
  edit_image_gallery: { category: "Image Gallery", label: "Edit" },

  add_city: { category: "City", label: "Add" },
  edit_city: { category: "City", label: "Edit" },
  delete_city: { category: "City", label: "Delete" },
  view_city: { category: "City", label: "View" },

  view_property_type: { category: "Property Type", label: "View" },
  add_property_type: { category: "Property Type", label: "Add" },
  edit_property_type: { category: "Property Type", label: "Edit" },
  delete_property_type: { category: "Property Type", label: "Delete" },

  add_review: { category: "Review", label: "Add" },
  edit_review: { category: "Review", label: "Edit" },
  delete_review: { category: "Review", label: "Delete" },
  view_my_review: { category: "Review", label: "View My" },
  edit_review_status: { category: "Review", label: "Edit Status" },
  view_all_review: { category: "Review", label: "View All" },

  view_ai_search_log: { category: "AI Search Log", label: "View" },

  view_role: { category: "Role", label: "View" },
  add_role: { category: "Role", label: "Add" },
  edit_role: { category: "Role", label: "Edit" },
  delete_role: { category: "Role", label: "Delete" },

  view_user: { category: "User", label: "View" },
  edit_user_role: { category: "User", label: "Edit Role" },
};

export function getPermissionMeta(name: string): PermissionMeta {
  return (
    PERMISSION_META[name] ?? {
      category: "Other",
      label: name.replace(/_/g, " "),
    }
  );
}