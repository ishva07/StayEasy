import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;

  loadingText?: string;

  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  loadingText = "Processing...",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault(); 
              onConfirm();
            }}
          >
            {loading ? loadingText : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


/* 

DataTable — kya sochna hai (khud banane ke liye guide)

Core concept: TanStack Table headless hai — matlab wo sirf logic deta hai (sorting, pagination state), UI khud banani hoti hai shadcn ke Table components se.

Socho ye pieces:

columns definition — kaunse fields dikhane hain, kaunsa custom render karna hai (jaise image, badge, action buttons)
useReactTable() hook — TanStack ka core hook, data, columns, aur pagination/sorting config leta hai
Kyunki tumhara backend server-side pagination/sorting karta hai (skip/take, orderBy) — TanStack Table ko manual mode mein rakhna hoga:
manualPagination: true
manualSorting: true
(Iska matlab: TanStack Table khud data ko sort/paginate nahi karega — wo sirf UI state manage karega, actual sorting/pagination tumhare backend API call se hogi)
Props jo bahar se aayenge:
data (current page ka data)
columns
pageCount (total pages, backend se)
pagination state (page, limit) + onPaginationChange
sorting state + onSortingChange

Ek hint: TanStack Table docs mein "Server-side Pagination" aur "Manual Sorting" example dhoondo — wahi pattern follow karna hai. Ye genuinely thoda tricky first time hai, but wahi seekhne wali cheez hai.

===================================================================================================
FormModal — kya sochna hai

Core concept: Ye ek wrapper hai shadcn ke Dialog component ka, jisme:

open/onClose control bahar se aata hai
Andar children (actual form fields) as prop aayenge
Ek footer mein Submit/Cancel buttons honge, isSubmitting state se disable/loading dikhayenge

Socho: Ye component khud koi form logic nahi rakhega — sirf modal ka shell hai. Actual form (react-hook-form + Zod) feature-specific component mein hoga (jaise HotelFormFields), jo is FormModal ke children mein pass hoga.
*/

