@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Logo SMS')
    <img src="{{ asset('images/logoSMS2.png') }}" class="logo" alt="SMS Logo">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
