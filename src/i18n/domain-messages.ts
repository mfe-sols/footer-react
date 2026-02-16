import { registerMessagesAll, t } from "@mfe-sols/i18n";
import type { FooterLocale } from "../mvp/view/types";

registerMessagesAll({
  en: {
    "mfe.footer.templateTitleSuffix": "Module",
    "mfe.footer.templateHeading1": "Heading 1",
    "mfe.footer.templateHeading2": "Heading 2",
    "mfe.footer.templateHeading3": "Heading 3",
    "mfe.footer.templateHeading4": "Heading 4",
    "mfe.footer.templateHeading5": "Heading 5",
    "mfe.footer.templateHeading6": "Heading 6",
    "mfe.footer.searchPlaceholder": "Search...",
    "mfe.footer.locale.switchAria": "Language",
    "mfe.footer.topUtilities": "Top utilities",
    "mfe.footer.theme.switchToLight": "Switch to light mode",
    "mfe.footer.theme.switchToDark": "Switch to dark mode",
    "mfe.footer.theme.lightMode": "Light mode",
    "mfe.footer.theme.darkMode": "Dark mode",
    "mfe.footer.nav.primary": "Primary navigation",
    "mfe.footer.nav.footer": "Footer navigation",
    "mfe.footer.nav.quick": "Quick navigation",
    "mfe.footer.mobile.home": "Home",
    "mfe.footer.mobile.categories": "Categories",
    "mfe.footer.mobile.lastNews": "Last news",
    "mfe.footer.mobile.myPage": "My page",
    "mfe.footer.mobile.logo": "Homepage",
    "mfe.footer.brand.primary": "Unified navigation space for every module in the platform.",
    "mfe.footer.brand.secondary": "Designed for consistent navigation patterns and scalable growth across the microfrontend ecosystem.",
    "mfe.footer.subscription.aria": "Email subscription",
    "mfe.footer.subscription.title": "Email Subscription",
    "mfe.footer.subscription.description": "Get product updates, release notes, and new technical announcements.",
    "mfe.footer.subscription.placeholder": "Enter your email",
    "mfe.footer.subscription.action": "Subscribe",
    "mfe.footer.subscription.success": "Subscribed successfully. Please check your confirmation email.",
    "mfe.footer.subscription.invalid": "Invalid email address. Please review and try again.",
    "mfe.footer.auth.login": "Login",
    "mfe.footer.auth.register": "Register",
  },
  vi: {
    "mfe.footer.templateTitleSuffix": "Mô-đun",
    "mfe.footer.templateHeading1": "Tiêu đề 1",
    "mfe.footer.templateHeading2": "Tiêu đề 2",
    "mfe.footer.templateHeading3": "Tiêu đề 3",
    "mfe.footer.templateHeading4": "Tiêu đề 4",
    "mfe.footer.templateHeading5": "Tiêu đề 5",
    "mfe.footer.templateHeading6": "Tiêu đề 6",
    "mfe.footer.searchPlaceholder": "Tìm kiếm...",
    "mfe.footer.locale.switchAria": "Ngôn ngữ",
    "mfe.footer.topUtilities": "Tiện ích trên cùng",
    "mfe.footer.theme.switchToLight": "Chuyển sang giao diện sáng",
    "mfe.footer.theme.switchToDark": "Chuyển sang giao diện tối",
    "mfe.footer.theme.lightMode": "Giao diện sáng",
    "mfe.footer.theme.darkMode": "Giao diện tối",
    "mfe.footer.nav.primary": "Điều hướng chính",
    "mfe.footer.nav.footer": "Điều hướng chân trang",
    "mfe.footer.nav.quick": "Điều hướng nhanh",
    "mfe.footer.mobile.home": "Trang chủ",
    "mfe.footer.mobile.categories": "Danh mục",
    "mfe.footer.mobile.lastNews": "Tin mới",
    "mfe.footer.mobile.myPage": "Trang tôi",
    "mfe.footer.mobile.logo": "Trang chính",
    "mfe.footer.brand.primary": "Unified navigation space for every module in the platform.",
    "mfe.footer.brand.secondary": "Tối ưu trải nghiệm điều hướng đồng nhất, mở rộng linh hoạt cho toàn bộ hệ sinh thái microfrontend.",
    "mfe.footer.subscription.aria": "Đăng ký email",
    "mfe.footer.subscription.title": "Email Subscription",
    "mfe.footer.subscription.description": "Nhận cập nhật sản phẩm, release notes và thông báo kỹ thuật mới.",
    "mfe.footer.subscription.placeholder": "Nhập email của bạn",
    "mfe.footer.subscription.action": "Đăng ký",
    "mfe.footer.subscription.success": "Đăng ký thành công. Vui lòng kiểm tra email xác nhận.",
    "mfe.footer.subscription.invalid": "Email không hợp lệ. Vui lòng kiểm tra lại.",
    "mfe.footer.auth.login": "Đăng nhập",
    "mfe.footer.auth.register": "Đăng ký",
  },
});

export const trFooter = (
  locale: FooterLocale,
  domainKey: string,
  commonKey: string,
): string => {
  const domainText = t(domainKey, locale);
  if (domainText !== domainKey) return domainText;
  return t(commonKey, locale);
};

export const trFooterDomain = (domainKey: string, commonKey: string): string => {
  const domainText = t(domainKey);
  if (domainText !== domainKey) return domainText;
  return t(commonKey);
};
