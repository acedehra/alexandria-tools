<script lang="ts">
  interface Props {
    icon: any;
    size?: "sm" | "md" | "lg" | "xl";
    class?: string;
    label?: string;
  }

  let { icon, size = "md", class: className = "", label }: Props = $props();

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  const iconClass = $derived(`${sizeClasses[size]} ${className}`);
</script>

<svelte:component
  this={icon}
  class={iconClass}
  aria-hidden={label ? undefined : "true"}
  aria-label={label}
/>
